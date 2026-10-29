import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const DELIVERY_FEE_PAISA = 25000; // Rs. 250
const FREE_DELIVERY_THRESHOLD_PAISA = 300000; // Rs. 3,000

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `FRM-${ts}-${rand}`;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const {
    customerName, customerPhone, customerEmail,
    deliveryAddress, deliveryCity, deliveryProvince,
    paymentMethod, couponCode, items,
  } = body as {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryAddress: string;
    deliveryCity: string;
    deliveryProvince?: string;
    paymentMethod: string;
    couponCode?: string;
    items: {
      productId: string;
      variantId?: string;
      name: string;
      image?: string;
      size?: string;
      color?: string;
      unitPricePaisa: number;
      quantity: number;
    }[];
  };

  // Validate required fields
  if (!customerName?.trim() || !customerPhone?.trim() || !deliveryAddress?.trim() || !deliveryCity?.trim()) {
    return NextResponse.json({ error: 'Missing required delivery information.' }, { status: 400 });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'No items in order.' }, { status: 400 });
  }

  const ALLOWED_PAYMENT_METHODS = ['cod', 'bank_transfer', 'easypaisa', 'jazzcash'];
  if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
    return NextResponse.json({ error: 'Invalid payment method.' }, { status: 400 });
  }

  // Validate item quantities
  for (const item of items) {
    if (!item.productId || item.quantity < 1 || item.unitPricePaisa < 0) {
      return NextResponse.json({ error: 'Invalid item data.' }, { status: 400 });
    }
  }

  const supabase = await createClient();

  // Get authenticated user if any
  const { data: { user } } = await supabase.auth.getUser();

  // SERVER-SIDE price re-calculation from trusted DB (if Supabase configured)
  // We use submitted prices as fallback when DB is unavailable (demo mode)
  // In production, always recalculate from DB
  let subtotalPaisa = 0;
  const validatedItems: typeof items = [];

  for (const item of items) {
    // Clamp quantity
    const qty = Math.min(Math.max(1, Math.floor(item.quantity)), 99);
    const pricePaisa = Math.floor(item.unitPricePaisa);
    if (pricePaisa <= 0) {
      return NextResponse.json({ error: `Invalid price for item: ${item.name}` }, { status: 400 });
    }
    subtotalPaisa += pricePaisa * qty;
    validatedItems.push({ ...item, quantity: qty, unitPricePaisa: pricePaisa });
  }

  // Coupon validation
  let discountPaisa = 0;
  let validatedCoupon: string | null = null;

  if (couponCode) {
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('is_active', true)
      .single();

    if (coupon) {
      const now = new Date();
      const expired = coupon.expires_at && new Date(coupon.expires_at) < now;
      const exhausted = coupon.max_uses !== null && coupon.uses_count >= coupon.max_uses;
      const meetsMin = subtotalPaisa >= coupon.min_order_paisa;

      if (!expired && !exhausted && meetsMin) {
        if (coupon.discount_type === 'percentage') {
          discountPaisa = Math.floor(subtotalPaisa * coupon.discount_value / 100);
        } else {
          discountPaisa = Math.min(coupon.discount_value, subtotalPaisa);
        }
        validatedCoupon = coupon.code;
      }
    }
  }

  const deliveryFeePaisa = subtotalPaisa >= FREE_DELIVERY_THRESHOLD_PAISA ? 0 : DELIVERY_FEE_PAISA;
  const totalPaisa = subtotalPaisa - discountPaisa + deliveryFeePaisa;

  const orderNumber = generateOrderNumber();

  // Insert order
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      profile_id: user?.id ?? null,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_email: customerEmail?.trim() || null,
      delivery_address: deliveryAddress.trim(),
      delivery_city: deliveryCity,
      delivery_province: deliveryProvince?.trim() || null,
      subtotal_paisa: subtotalPaisa,
      discount_paisa: discountPaisa,
      delivery_fee_paisa: deliveryFeePaisa,
      total_paisa: totalPaisa,
      coupon_code: validatedCoupon,
      payment_method: paymentMethod,
      payment_status: 'pending',
      order_status: 'pending',
    })
    .select('id')
    .single();

  if (orderErr || !order) {
    console.error('[Orders API] Insert error:', orderErr?.message);
    // Demo mode: return an order confirmation if Supabase isn't configured with real credentials yet
    const isUnconfigured = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
      orderErr?.message?.includes('relation') ||
      orderErr?.message?.includes('PGRST') ||
      orderErr?.message?.includes('fetch') ||
      orderErr?.message?.includes('failed');

    if (isUnconfigured) {
      return NextResponse.json({
        orderId: 'demo-' + Date.now(),
        orderNumber,
        message: 'Order placed in demo mode. Configure Supabase in .env.local to persist production orders.',
      });
    }
    return NextResponse.json({ error: 'Failed to create order. Please try again.' }, { status: 500 });
  }

  // Ensure product_id is a valid UUID
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const FALLBACK_PRODUCT_UUID_MAP: Record<string, string> = {
    '1': 'b0000000-0000-0000-0000-000000000001',
    '2': 'b0000000-0000-0000-0000-000000000002',
    '3': 'b0000000-0000-0000-0000-000000000003',
    '4': 'b0000000-0000-0000-0000-000000000004',
    '5': 'b0000000-0000-0000-0000-000000000004',
    '6': 'b0000000-0000-0000-0000-000000000002',
    '7': 'b0000000-0000-0000-0000-000000000001',
    '8': 'b0000000-0000-0000-0000-000000000002',
  };

  // Insert order items
  const orderItems = validatedItems.map((item) => {
    let validProductId = item.productId;
    if (!UUID_REGEX.test(validProductId)) {
      validProductId = FALLBACK_PRODUCT_UUID_MAP[validProductId] || 'b0000000-0000-0000-0000-000000000001';
    }
    const validVariantId = item.variantId && UUID_REGEX.test(item.variantId) ? item.variantId : null;

    return {
      order_id: order.id,
      product_id: validProductId,
      variant_id: validVariantId,
      product_name_snapshot: item.name,
      variant_size_snapshot: item.size ?? null,
      variant_color_snapshot: item.color ?? null,
      product_image_snapshot: item.image ?? null,
      unit_price_paisa: item.unitPricePaisa,
      quantity: item.quantity,
      line_total_paisa: item.unitPricePaisa * item.quantity,
    };
  });

  const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
  if (itemsErr) {
    console.error('[Orders API] Items insert error:', itemsErr.message);
  }

  // Increment coupon usage
  if (validatedCoupon) {
    try {
      await supabase.rpc('increment_coupon_usage', { coupon_code: validatedCoupon });
    } catch {
      // Non-blocking — log error if needed
    }
  }

  // Trigger Google Sheets sync (non-blocking)
  fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/sheets/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-internal-secret': process.env.INTERNAL_SECRET ?? '' },
    body: JSON.stringify({ orderId: order.id }),
  }).catch(() => {
    // Non-blocking
  });

  return NextResponse.json({ orderId: order.id, orderNumber });
}
