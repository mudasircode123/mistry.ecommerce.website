import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';


export async function GET() {
  return NextResponse.json(
    {
      error: 'Demo admin bypass is disabled. Access is restricted to authorized administrators.',
    },
    { status: 403 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      error: 'Demo credentials disabled. Please sign in with an authorized administrator account.',
    },
    { status: 403 }
  );
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('forme_admin_session');
  return NextResponse.json({ success: true, message: 'Admin session terminated.' });
}

