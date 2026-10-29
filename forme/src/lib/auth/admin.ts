import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { AUTHORIZED_ADMIN_EMAIL } from './constants';

export { AUTHORIZED_ADMIN_EMAIL };

function getAdminClient(sessionClient: Awaited<ReturnType<typeof createClient>>) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // If a distinct service role key is configured, use service client to bypass RLS in admin actions
  if (serviceKey && serviceKey !== anonKey && !serviceKey.includes('placeholder')) {
    try {
      return createServiceClient();
    } catch {
      return sessionClient;
    }
  }
  return sessionClient;
}

/**
 * Checks that the current request is authenticated and authorized as the administrator.
 * Only mudasir123456mu@gmail.com is authorized.
 * 
 * For page requests (currentPath provided): redirects unauthenticated or unauthorized users.
 * For API requests (currentPath omitted): throws an Error with status description.
 */
export async function requireAdmin(currentPath?: string) {
  const supabase = await createClient();

  // Clean up any stale demo admin session cookie if present
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('forme_admin_session')) {
      cookieStore.delete('forme_admin_session');
    }
  } catch {
    // Non-fatal if headers are read-only
  }

  // 1. Verify authenticated Supabase session
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    if (currentPath) {
      redirect(`/account/login?next=${encodeURIComponent(currentPath)}`);
    }
    throw new Error('Unauthorized: Admin authentication required');
  }

  const userEmail = (user.email ?? '').toLowerCase().trim();
  const authorizedEmail = AUTHORIZED_ADMIN_EMAIL.toLowerCase().trim();

  // 2. Strict check: only mudasir123456mu@gmail.com can be admin
  if (userEmail !== authorizedEmail) {
    // Defense-in-depth: if an ordinary customer profile was erroneously marked as admin, demote it
    try {
      const { data: customerProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (customerProfile?.role === 'admin') {
        await supabase
          .from('profiles')
          .update({ role: 'customer' })
          .eq('id', user.id);
      }
    } catch {
      // Demotion attempt non-fatal
    }

    if (currentPath) {
      redirect('/account?error=unauthorized');
    }
    throw new Error('Forbidden: Access denied. Administrator privileges required.');
  }

  // 3. User email is mudasir123456mu@gmail.com — verify database profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, email')
    .eq('id', user.id)
    .maybeSingle();

  // If profile does not exist or role is not yet set to 'admin', sync it in the database
  if (!profile || profile.role !== 'admin') {
    try {
      await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            email: authorizedEmail,
            role: 'admin',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );
    } catch {
      // Continue with verified user
    }
  }

  return {
    user,
    supabase: getAdminClient(supabase),
    isDemo: false,
  };
}

