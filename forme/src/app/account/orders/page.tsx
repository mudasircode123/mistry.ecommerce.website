import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Package, ArrowLeft, Truck } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { BRAND, formatPrice } from '@/lib/config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `My Orders — ${BRAND.name}`,
};

const ORDER_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#D97706', bg: '#FEF3C7' },
  confirmed: { label: 'Confirmed', color: '#2563EB', bg: '#DBEAFE' },
  processing: { label: 'Processing', color: '#7C3AED', bg: '#EDE9FE' },
  shipped: { label: 'Shipped', color: '#0891B2', bg: '#CFFAFE' },
  out_for_delivery: { label: 'Out for Delivery', color: '#059669', bg: '#D1FAE5' },
  delivered: { label: 'Delivered', color: '#16A34A', bg: '#DCFCE7' },
  cancelled: { label: 'Cancelled', color: '#DC2626', bg: '#FEE2E2' },
  returned: { label: 'Returned', color: '#6B7280', bg: '#F3F4F6' },
};

export default async function AccountOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/account/login?next=/account/orders');
  }

  // Fetch all orders for this user
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      order_status,
      payment_status,
      payment_method,
      total_paisa,
      delivery_address,
      delivery_city,
      tracking_number,
      courier_name,
      tracking_url,
      created_at,
      order_items (
        id,
        product_name_snapshot,
        variant_size_snapshot,
        variant_color_snapshot,
        product_image_snapshot,
        unit_price_paisa,
        quantity,
        line_total_paisa
      )
    `)
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <>
      <Header />
      <main id="main-content" style={{ minHeight: '60vh', background: '#F4F1EB', paddingTop: 'calc(var(--announcement-height) + var(--header-height))' }}>
        {/* Header */}
        <div style={{ background: '#171717', color: '#fff', padding: 'clamp(28px, 4vw, 48px) 0' }}>
          <div className="container-wide">
            <Link
              href="/account"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: 'rgba(255,255,255,0.7)',
                fontSize: 13,
                marginBottom: 16,
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={16} /> Back to My Account
            </Link>
            <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700 }}>My Orders</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>
              Track shipments and review past orders
            </p>
          </div>
        </div>

        <div className="container-wide" style={{ padding: 'clamp(32px, 4vw, 56px) 24px' }}>
          {!orders || orders.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #D8D4CD', padding: '64px 24px', textAlign: 'center', color: '#6B665F' }}>
              <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#171717', marginBottom: 8 }}>No orders placed yet</h2>
              <p style={{ fontSize: 14, marginBottom: 24 }}>Once you make a purchase, your order history will appear here.</p>
              <Link href="/collections/new-arrivals" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                Explore Collection
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {orders.map((order) => {
                const statusCfg = ORDER_STATUS_CONFIG[order.order_status] ?? {
                  label: order.order_status,
                  color: '#6B7280',
                  bg: '#F3F4F6',
                };

                const items = order.order_items || [];
                const itemCount = items.reduce((sum, it) => sum + (it.quantity || 1), 0);

                return (
                  <div
                    key={order.id}
                    style={{
                      background: '#fff',
                      border: '1px solid #D8D4CD',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Order Bar */}
                    <div
                      style={{
                        padding: '16px 20px',
                        background: '#FAF8F5',
                        borderBottom: '1px solid #E8E4DD',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 12,
                        fontSize: 13,
                      }}
                    >
                      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                        <div>
                          <span style={{ color: '#6B665F', display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Number</span>
                          <span style={{ fontWeight: 700, color: '#171717' }}>#{order.order_number}</span>
                        </div>
                        <div>
                          <span style={{ color: '#6B665F', display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date Placed</span>
                          <span style={{ color: '#171717' }}>
                            {new Date(order.created_at).toLocaleDateString('en-PK', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: '#6B665F', display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Amount</span>
                          <span style={{ fontWeight: 700, color: '#171717' }}>{formatPrice(order.total_paisa)} <span style={{ fontWeight: 400, fontSize: 12, color: '#6B665F' }}>({itemCount} item{itemCount === 1 ? '' : 's'})</span></span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span
                          style={{
                            background: statusCfg.bg,
                            color: statusCfg.color,
                            padding: '4px 12px',
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusCfg.color }} />
                          {statusCfg.label}
                        </span>
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="btn btn-outline"
                          style={{ fontSize: 12, padding: '6px 14px', textDecoration: 'none' }}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>

                    {/* Items List */}
                    <div style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {items.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 16,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                              <div
                                style={{
                                  width: 48,
                                  height: 48,
                                  background: '#E8E4DD',
                                  borderRadius: 4,
                                  overflow: 'hidden',
                                  flexShrink: 0,
                                }}
                              >
                                {item.product_image_snapshot ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={item.product_image_snapshot}
                                    alt={item.product_name_snapshot}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Package size={18} style={{ opacity: 0.3 }} />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p style={{ fontWeight: 600, fontSize: 14, color: '#171717' }}>{item.product_name_snapshot}</p>
                                <p style={{ fontSize: 12, color: '#6B665F' }}>
                                  Qty: {item.quantity}
                                  {item.variant_size_snapshot && ` • Size: ${item.variant_size_snapshot}`}
                                  {item.variant_color_snapshot && ` • Color: ${item.variant_color_snapshot}`}
                                </p>
                              </div>
                            </div>
                            <span style={{ fontWeight: 600, fontSize: 13, color: '#171717' }}>
                              {formatPrice(item.line_total_paisa || item.unit_price_paisa * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Tracking / Address Info */}
                      {(order.tracking_number || order.delivery_address) && (
                        <div
                          style={{
                            marginTop: 18,
                            paddingTop: 14,
                            borderTop: '1px solid #F0EEE9',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 12,
                            fontSize: 12,
                            color: '#6B665F',
                          }}
                        >
                          <div>
                            <span>Delivering to: </span>
                            <strong style={{ color: '#171717' }}>
                              {order.delivery_city}
                            </strong>
                            {' — '}{order.delivery_address}
                          </div>

                          {order.tracking_number && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Truck size={14} />
                              <span>Tracking: </span>
                              {order.tracking_url ? (
                                <a
                                  href={order.tracking_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'underline' }}
                                >
                                  {order.tracking_number} ({order.courier_name || 'Courier'})
                                </a>
                              ) : (
                                <strong style={{ color: '#171717' }}>{order.tracking_number}</strong>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
