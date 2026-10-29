import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const {
    name,
    email,
    phone,
    subject,
    category = 'general',
    orderNumber,
    message,
    source = 'contact_form',
  } = body as {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    category?: 'general' | 'order_inquiry' | 'returns' | 'wholesale' | 'feedback' | 'ai_assistant';
    orderNumber?: string;
    message?: string;
    source?: string;
  };

  // Validation
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
  }

  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
  }

  const validCategories = ['general', 'order_inquiry', 'returns', 'wholesale', 'feedback', 'ai_assistant'];
  const sanitizedCategory = validCategories.includes(category) ? category : 'general';

  // Client IP
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    null;

  const supabase = await createClient();

  // Check if authenticated
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      subject: subject?.trim() || null,
      category: sanitizedCategory as 'general' | 'order_inquiry' | 'returns' | 'wholesale' | 'feedback' | 'ai_assistant',
      order_number: orderNumber?.trim() || null,
      message: message.trim(),
      source: source || 'contact_form',
      status: 'new',
      ip_address: ip,
      user_id: user?.id ?? null,
    })
    .select('id, created_at')
    .single();

  if (error) {
    console.error('[Inquiries API] Error saving inquiry:', error.message);
    return NextResponse.json(
      { error: 'Failed to submit inquiry. Please try again later.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    inquiryId: data.id,
    message: 'Your inquiry has been submitted successfully. Our customer support team will contact you soon.',
  });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ inquiries: data });
}
