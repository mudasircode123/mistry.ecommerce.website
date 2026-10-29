import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Package, MapPin, Heart, Settings, LogOut, ShieldCheck, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { BRAND, formatPrice } from '@/lib/config';
import { AUTHORIZED_ADMIN_EMAIL } from '@/lib/auth/constants';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `My Account — ${BRAND.name}`,
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const isUnauthorized = params?.error === 'unauthorized';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/account/login');
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const userEmail = (user.email ?? '').toLowerCase().trim();
  const isAdmin = userEmail === AUTHORIZED_ADMIN_EMAIL.toLowerCase() && profile?.role === 'admin';


  // Fetch recent orders
  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, order_status, payment_status, total_paisa, created_at')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const displayName = profile?.full_name ?? user.email?.split('@')[0] ?? 'Customer';

  const ORDER_STATUS_LABEL: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    returned: 'Returned',
  };

  const STATUS_COLOR: Record<string, string> = {
    pending: '#D97706',
    confirmed: '#2563EB',
    processing: '#7C3AED',
    shipped: '#0891B2',
    out_for_delivery: '#059669',
    delivered: '#16A34A',
    cancelled: '#DC2626',
    returned: '#6B7280',
  };

  const navCards = [
    ...(isAdmin ? [{ icon: ShieldCheck, label: 'Admin Dashboard', desc: 'Store, products & orders', href: '/admin', highlight: true }] : []),
    { icon: Package, label: 'My Orders', desc: 'Track and manage orders', href: '/account/orders' },
    { icon: MapPin, label: 'Addresses', desc: 'Saved delivery addresses', href: '/account/addresses' },
    { icon: Heart, label: 'Wishlist', desc: 'Saved items', href: '/wishlist' },
    { icon: Settings, label: 'Settings', desc: 'Profile & password', href: '/account/settings' },
  ];

  return (
    <>
      <Header />
      <main id="main-content" style={{ minHeight: '60vh', background: '#F4F1EB', paddingTop: 'calc(var(--announcement-height) + var(--header-height))' }}>
        {/* Account Header */}
        <div style={{ background: '#171717', color: '#fff', padding: 'clamp(32px, 5vw, 56px) 0' }}>
          <div className="container-wide" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
                My Account {isAdmin && '• Administrator'}
              </p>
              <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.01em' }}>
                Welcome back, {displayName}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 6 }}>{user.email}</p>
            </div>
            {isAdmin && (
              <Link
                href="/admin"
                className="btn btn-primary"
                style={{ background: '#fff', color: '#171717', display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
              >
                <ShieldCheck size={16} /> Open Admin Panel
              </Link>
            )}
          </div>
        </div>

        <div className="container-wide" style={{ padding: 'clamp(32px, 4vw, 56px) 24px' }}>
          {isUnauthorized && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 4, padding: '14px 18px', marginBottom: 28, color: '#b91c1c', fontSize: 13, lineHeight: 1.5 }}>
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <strong style={{ display: 'block', fontSize: 14, marginBottom: 2 }}>Access Denied: Administrative Privileges Required</strong>
                The Admin Dashboard is strictly restricted to authorized store administrators. Your account does not have administrative access.
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
            {navCards.map(({ icon: Icon, label, desc, href, highlight }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  background: highlight ? '#171717' : '#fff',
                  border: highlight ? '1px solid #171717' : '1px solid #D8D4CD',
                  padding: '20px 24px',
                  textDecoration: 'none',
                  color: highlight ? '#fff' : '#171717',
                  transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s',
                }}
                className="account-nav-card"
              >
                <div style={{ width: 44, height: 44, background: highlight ? '#2A2A2A' : '#F4F1EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={highlight ? '#F4F1EB' : '#171717'} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: 12, color: highlight ? 'rgba(255,255,255,0.7)' : '#6B665F' }}>{desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Orders */}
          <div style={{ background: '#fff', border: '1px solid #D8D4CD', padding: 'clamp(24px, 3vw, 36px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Recent Orders</h2>
              <Link href="/account/orders" style={{ fontSize: 13, color: '#171717', textDecoration: 'underline', fontWeight: 600 }}>
                View all orders
              </Link>
            </div>

            {!orders || orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B665F' }}>
                <Package size={40} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
                <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>No orders yet</p>
                <p style={{ fontSize: 13, marginBottom: 24 }}>Start shopping to see your orders here.</p>
                <Link href="/collections/new-arrivals" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                  Shop Now
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E8E4DD' }}>
                      {['Order', 'Date', 'Status', 'Total', ''].map((h) => (
                        <th key={h} style={{ textAlign: 'left', padding: '10px 16px 10px 0', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B665F' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #F4F1EB' }}>
                        <td style={{ padding: '16px 16px 16px 0', fontWeight: 700 }}>#{order.order_number}</td>
                        <td style={{ padding: '16px 16px 16px 0', color: '#6B665F' }}>
                          {new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '16px 16px 16px 0' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center',
                            background: `${STATUS_COLOR[order.order_status] ?? '#6B7280'}18`,
                            color: STATUS_COLOR[order.order_status] ?? '#6B7280',
                            padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                          }}>
                            {ORDER_STATUS_LABEL[order.order_status] ?? order.order_status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 16px 16px 0', fontWeight: 700 }}>
                          {formatPrice(order.total_paisa)}
                        </td>
                        <td style={{ padding: '16px 0' }}>
                          <Link href={`/account/orders/${order.id}`} style={{ fontSize: 12, color: '#171717', textDecoration: 'underline', fontWeight: 600 }}>
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sign out */}
          <form action="/auth/signout" method="POST" style={{ marginTop: 32, textAlign: 'center' }}>
            <button type="submit" className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#6B665F', fontSize: 13 }}>
              <LogOut size={16} />Sign Out
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
