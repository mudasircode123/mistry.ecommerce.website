import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL('/account/reset-password', req.url);
  return NextResponse.redirect(url);
}
