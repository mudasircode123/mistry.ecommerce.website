import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request' }, { status: 400 });
  }

  const { email, source = 'website' } = (body as { email?: string; source?: string }) || {};

  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({
      email: email.trim().toLowerCase(),
      source: source || 'website',
      is_active: true,
    });

  if (error) {
    // If duplicate email, consider it already subscribed
    if (error.code === '23505' || error.message.includes('unique')) {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to FORME updates.',
      });
    }

    console.error('[Newsletter API] Insert error:', error.message);
    return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Thank you for subscribing to FORME updates and exclusive offers.',
  });
}
