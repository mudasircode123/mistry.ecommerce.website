import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { google } from 'googleapis';

// Internal-only route — protected by secret header
export async function POST(req: NextRequest) {
  // Validate internal secret to prevent external calls
  const secret = req.headers.get('x-internal-secret');
  if (!process.env.INTERNAL_SECRET || secret !== process.env.INTERNAL_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { orderId } = body as { orderId: string };
  if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

  // Check if Google Sheets is configured
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
    // Not configured — log but don't fail
    console.log('[Sheets Sync] Google Sheets not configured. Skipping sync.');
    return NextResponse.json({ skipped: true, reason: 'Google Sheets not configured' });
  }

  const supabase = await createClient();

  // Check if already synced (idempotency)
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .select(`
      id, order_number, customer_name, customer_phone, customer_email,
      delivery_city, delivery_address, subtotal_paisa, discount_paisa,
      delivery_fee_paisa, total_paisa, payment_method, payment_status,
      order_status, sheets_synced, created_at,
      order_items (
        product_name_snapshot, variant_size_snapshot, variant_color_snapshot,
        unit_price_paisa, quantity, line_total_paisa
      )
    `)
    .eq('id', orderId)
    .single();

  if (orderErr || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (order.sheets_synced) {
    return NextResponse.json({ skipped: true, reason: 'Already synced' });
  }

  // Format row data
  const items = (order.order_items as {
    product_name_snapshot: string;
    variant_size_snapshot: string | null;
    variant_color_snapshot: string | null;
    unit_price_paisa: number;
    quantity: number;
    line_total_paisa: number;
  }[] ?? []);

  const productNames = items.map((i) => i.product_name_snapshot).join('; ');
  const variants = items.map((i) => [i.variant_size_snapshot, i.variant_color_snapshot].filter(Boolean).join('/')).join('; ');
  const quantities = items.map((i) => String(i.quantity)).join('; ');

  const rowData = [
    order.order_number,
    new Date(order.created_at).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }),
    order.customer_name,
    order.customer_phone,
    order.customer_email ?? '',
    order.delivery_city,
    order.delivery_address,
    productNames,
    variants,
    quantities,
    (order.subtotal_paisa / 100).toFixed(0),
    (order.discount_paisa / 100).toFixed(0),
    (order.delivery_fee_paisa / 100).toFixed(0),
    (order.total_paisa / 100).toFixed(0),
    order.payment_method,
    order.payment_status,
    order.order_status,
  ];

  try {
    // Authenticate with Google
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;

    // Check if order already exists in sheet (idempotency via order number)
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Orders!A:A',
    });

    const existingValues = existing.data.values ?? [];
    const alreadyInSheet = existingValues.some((row) => row[0] === order.order_number);

    if (!alreadyInSheet) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Orders!A:Q',
        valueInputOption: 'RAW',
        requestBody: { values: [rowData] },
      });
    }

    // Mark as synced
    await supabase
      .from('orders')
      .update({ sheets_synced: true, sheets_sync_error: null })
      .eq('id', orderId);

    return NextResponse.json({ success: true, orderNumber: order.order_number });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Sheets Sync] Error:', message);

    // Record failure
    await supabase
      .from('orders')
      .update({ sheets_sync_error: message })
      .eq('id', orderId);

    return NextResponse.json({ error: 'Sync failed', details: message }, { status: 500 });
  }
}
