import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, MapPin, CreditCard } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { BRAND, formatPrice } from '@/lib/config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Order Details — ${BRAND.name}`,
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

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/account/login?next=/account/orders/${id}`);
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('profile_id', user.id);

  if (isUuid) {
    query = query.eq('id', id);
  } else {
    query = query.eq('order_number', id);
  }

  const { data: order, error } = await query.single();

  if (error || !order) {
    notFound();
  }

  const statusCfg = ORDER_STATUS_CONFIG[order.order_status] ?? {
    label: order.order_status,
    color: '#6B7280',
    bg: '#F3F4F6',
  };

  const items = order.order_items || [];

  return (
    <>
      <Header />
      <main id="main-content" style={{ minHeight: '60vh', background: '#F4F1EB', paddingTop: 'calc(var(--announcement-height) + var(--header-height))' }}>
        <div style={{ background: '#171717', color: '#fff', padding: 'clamp(28px, 4vw, 44px) 0' }}>
          <div className="container-wide">
            <Link
              href="/account/orders"
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
              <ArrowLeft size={16} /> Back to All Orders
            </Link>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h1 style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 700 }}>
                  Order #{order.order_number}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>
                  Placed on {new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <span
                style={{
                  background: statusCfg.bg,
                  color: statusCfg.color,
                  padding: '6px 16px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusCfg.color }} />
                {statusCfg.label}
              </span>
            </div>
          </div>
        </div>

        <div className="container-wide" style={{ padding: 'clamp(32px, 4vw, 56px) 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
            {/* Left Column: Items */}
            <div style={{ background: '#fff', border: '1px solid #D8D4CD', padding: '24px' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Order Items ({items.length})</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: 16, paddingBottom: 16, borderBottom: '1px solid #F4F1EB' }}>
                    <div style={{ width: 64, height: 72, background: '#E8E4DD', borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
                      {item.product_image_snapshot ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.product_image_snapshot} alt={item.product_name_snapshot} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Package size={20} style={{ opacity: 0.3 }} />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: 14, color: '#171717', marginBottom: 4 }}>
                        {item.product_name_snapshot}
                      </p>
                      <p style={{ fontSize: 12, color: '#6B665F', marginBottom: 6 }}>
                        Qty: {item.quantity}
                        {item.variant_size_snapshot && ` • Size: ${item.variant_size_snapshot}`}
                        {item.variant_color_snapshot && ` • Color: ${item.variant_color_snapshot}`}
                      </p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#171717' }}>
                        {formatPrice(item.unit_price_paisa)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #E8E4DD', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B665F' }}>
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal_paisa)}</span>
                </div>
                {order.discount_paisa > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                    <span>Discount {order.coupon_code && `(${order.coupon_code})`}</span>
                    <span>−{formatPrice(order.discount_paisa)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B665F' }}>
                  <span>Delivery Fee</span>
                  <span>{order.delivery_fee_paisa === 0 ? 'FREE' : formatPrice(order.delivery_fee_paisa)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#171717', paddingTop: 12, borderTop: '1px solid #E8E4DD' }}>
                  <span>Total</span>
                  <span>{formatPrice(order.total_paisa)}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Delivery & Payment Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: '#fff', border: '1px solid #D8D4CD', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <MapPin size={18} />
                  <h3 style={{ fontSize: 15, fontWeight: 700 }}>Delivery Information</h3>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#171717', marginBottom: 4 }}>{order.customer_name}</p>
                <p style={{ fontSize: 13, color: '#6B665F', marginBottom: 4 }}>Phone: {order.customer_phone}</p>
                {order.customer_email && <p style={{ fontSize: 13, color: '#6B665F', marginBottom: 8 }}>Email: {order.customer_email}</p>}
                <p style={{ fontSize: 13, color: '#171717', lineHeight: 1.5 }}>
                  {order.delivery_address}<br />
                  {order.delivery_city}{order.delivery_province ? `, ${order.delivery_province}` : ''}
                </p>
              </div>

              <div style={{ background: '#fff', border: '1px solid #D8D4CD', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <CreditCard size={18} />
                  <h3 style={{ fontSize: 15, fontWeight: 700 }}>Payment Details</h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: '#6B665F' }}>Payment Method:</span>
                  <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>{order.payment_method}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#6B665F' }}>Payment Status:</span>
                  <span style={{ fontWeight: 600, color: order.payment_status === 'paid' ? '#16A34A' : '#D97706', textTransform: 'capitalize' }}>
                    {order.payment_status}
                  </span>
                </div>
              </div>

              {order.tracking_number && (
                <div style={{ background: '#fff', border: '1px solid #D8D4CD', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <Truck size={18} />
                    <h3 style={{ fontSize: 15, fontWeight: 700 }}>Shipment Tracking</h3>
                  </div>
                  <p style={{ fontSize: 13, color: '#6B665F', marginBottom: 8 }}>
                    Courier: <strong style={{ color: '#171717' }}>{order.courier_name || 'Standard Courier'}</strong>
                  </p>
                  <p style={{ fontSize: 13, color: '#6B665F', marginBottom: 14 }}>
                    Tracking #: <strong style={{ color: '#171717' }}>{order.tracking_number}</strong>
                  </p>
                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ fontSize: 12, padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
                    >
                      Track on Courier Site
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
