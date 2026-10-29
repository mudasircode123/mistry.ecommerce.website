import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Phone, Mail, CreditCard } from 'lucide-react';
import { BRAND, formatPrice } from '@/lib/config';
import { getOrderBadge } from '@/lib/admin/statusBadges';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/admin';
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: `Order Details — Admin — ${BRAND.name}` };


export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const { supabase } = await requireAdmin(`/admin/orders/${id}`);

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  const query = supabase
    .from('orders')
    .select(`
      id, order_number, customer_name, customer_phone, customer_email,
      delivery_address, delivery_city, delivery_province,
      order_status, payment_status, payment_method, coupon_code,
      subtotal_paisa, discount_paisa, delivery_fee_paisa, total_paisa,
      created_at,
      order_items(id, product_name_snapshot, variant_size_snapshot, variant_color_snapshot, unit_price_paisa, quantity, line_total_paisa)
    `);

  const { data: order, error } = isUuid
    ? await query.eq('id', id).maybeSingle()
    : await query.eq('order_number', id).maybeSingle();

  if (error || !order) {
    notFound();
  }

  const items = (order.order_items || []) as {
    id: string;
    product_name_snapshot: string;
    variant_size_snapshot: string | null;
    variant_color_snapshot: string | null;
    unit_price_paisa: number;
    quantity: number;
    line_total_paisa: number;
  }[];

  const statusCfg = getOrderBadge(order.order_status);

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Header Card */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          background: '#FFFFFF',
          padding: 'clamp(14px, 2vw, 24px)',
          borderRadius: 12,
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link
            href="/admin/orders"
            style={{
              color: '#6B7280',
              textDecoration: 'none',
              display: 'flex',
              padding: '6px',
              borderRadius: 6,
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
            }}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 700, color: '#1F2937', margin: 0 }}>
                Order #{order.order_number}
              </h1>
              <span
                style={{
                  background: statusCfg.bg,
                  color: statusCfg.text,
                  padding: '4px 10px',
                  borderRadius: 9999,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {statusCfg.label}
              </span>
            </div>
            <p style={{ color: '#6B7280', fontSize: 13, margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={14} /> Placed on {new Date(order.created_at).toLocaleString('en-PK')}
            </p>
          </div>
        </div>

        <OrderStatusUpdater orderId={order.id} initialStatus={order.order_status} />
      </div>

      {/* Customer & Payment Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
        {/* Customer Info Card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            padding: '24px',
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', marginBottom: 16 }}>
            Customer Information
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: '#4B5563' }}>
            <div>
              <span style={{ color: '#9CA3AF', display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>
                Recipient Name
              </span>
              <strong style={{ color: '#1F2937', fontSize: 14 }}>{order.customer_name}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Phone size={15} color="#7C3AED" />
              <span style={{ color: '#1F2937' }}>{order.customer_phone}</span>
            </div>
            {order.customer_email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={15} color="#7C3AED" />
                <span>{order.customer_email}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 4 }}>
              <MapPin size={15} color="#7C3AED" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ color: '#1F2937' }}>{order.delivery_address}</div>
                <div style={{ color: '#6B7280', fontSize: 12 }}>
                  {order.delivery_city}{order.delivery_province ? `, ${order.delivery_province}` : ''}, Pakistan
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Summary Card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            padding: '24px',
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', marginBottom: 16 }}>
            Payment & Breakdown
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280' }}>
                <CreditCard size={15} /> Payment Method:
              </div>
              <strong style={{ textTransform: 'uppercase', color: '#1F2937' }}>{order.payment_method}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>Payment Status:</span>
              <span
                style={{
                  color: order.payment_status === 'paid' ? '#16A34A' : '#D97706',
                  fontWeight: 700,
                  textTransform: 'capitalize',
                }}
              >
                {order.payment_status}
              </span>
            </div>
            {order.coupon_code && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280' }}>Coupon Applied:</span>
                <span style={{ color: '#7C3AED', fontWeight: 600 }}>{order.coupon_code}</span>
              </div>
            )}

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 12, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
                <span>Subtotal</span>
                <span style={{ color: '#1F2937' }}>{formatPrice(order.subtotal_paisa)}</span>
              </div>
              {order.discount_paisa > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A' }}>
                  <span>Discount</span>
                  <span>−{formatPrice(order.discount_paisa)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
                <span>Delivery Fee</span>
                <span>{order.delivery_fee_paisa === 0 ? 'Free' : formatPrice(order.delivery_fee_paisa)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#1F2937', borderTop: '1px solid #E5E7EB', paddingTop: 10, marginTop: 4 }}>
                <span>Total Amount</span>
                <span style={{ color: '#7C3AED' }}>{formatPrice(order.total_paisa)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Card */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', marginBottom: 16 }}>
          Order Items ({items.length})
        </h2>
        {items.length === 0 ? (
          <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>No items details recorded for this order snapshot.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map((it, idx) => (
              <div
                key={it.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: idx === items.length - 1 ? 'none' : '1px solid #F1F5F9',
                  paddingBottom: idx === items.length - 1 ? 0 : 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#1F2937', fontSize: 14 }}>{it.product_name_snapshot}</div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>
                    {it.variant_size_snapshot && `Size: ${it.variant_size_snapshot} · `}
                    {it.variant_color_snapshot && `Color: ${it.variant_color_snapshot} · `}
                    Qty: {it.quantity} × {formatPrice(it.unit_price_paisa)}
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: '#1F2937', fontSize: 14 }}>
                  {formatPrice(it.line_total_paisa)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
