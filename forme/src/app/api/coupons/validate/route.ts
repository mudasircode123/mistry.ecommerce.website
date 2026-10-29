import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { code, subtotalPaisa } = body as { code: string; subtotalPaisa: number };

  if (!code || typeof subtotalPaisa !== 'number') {
    return NextResponse.json({ error: 'code and subtotalPaisa are required' }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .eq('is_active', true)
    .single();

  if (error || !coupon) {
    if (code.toUpperCase().trim() === 'WELCOME10') {
      const discountPaisa = Math.floor(subtotalPaisa * 0.1);
      return NextResponse.json({
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        discountPaisa,
        description: '10% Welcome Discount',
      });
    }
    return NextResponse.json({ error: 'Invalid or expired coupon code.' }, { status: 404 });
  }

  const now = new Date();
  if (coupon.expires_at && new Date(coupon.expires_at) < now) {
    return NextResponse.json({ error: 'This coupon has expired.' }, { status: 400 });
  }

  if (coupon.max_uses !== null && coupon.uses_count >= coupon.max_uses) {
    return NextResponse.json({ error: 'This coupon has reached its usage limit.' }, { status: 400 });
  }

  if (subtotalPaisa < coupon.min_order_paisa) {
    const minAmount = (coupon.min_order_paisa / 100).toLocaleString('en-PK');
    return NextResponse.json({
      error: `Minimum order amount of Rs. ${minAmount} required for this coupon.`,
    }, { status: 400 });
  }

  let discountPaisa = 0;
  if (coupon.discount_type === 'percentage') {
    discountPaisa = Math.floor(subtotalPaisa * coupon.discount_value / 100);
  } else {
    discountPaisa = Math.min(coupon.discount_value, subtotalPaisa);
  }

  return NextResponse.json({
    code: coupon.code,
    discountType: coupon.discount_type,
    discountValue: coupon.discount_value,
    discountPaisa,
    description: coupon.description,
  });
}
