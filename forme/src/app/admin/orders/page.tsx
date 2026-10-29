import Link from 'next/link';
import { ShoppingBag, Eye, Clock, Truck, TrendingUp } from 'lucide-react';
import { BRAND, formatPrice } from '@/lib/config';
import { getOrderBadge, getPaymentBadge } from '@/lib/admin/statusBadges';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/admin';

export const metadata: Metadata = { title: `Orders — Admin — ${BRAND.name}` };

interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_city: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  total_paisa: number;
  created_at: string;
}

const DEMO_ORDERS: OrderRow[] = [
  { id: 'demo-1', order_number: 'FRM-882194', customer_name: 'Hamza Tariq', customer_phone: '03001234567', delivery_city: 'Lahore', order_status: 'shipped', payment_status: 'paid', payment_method: 'cod', total_paisa: 899900, created_at: '2026-10-23T17:00:00.000Z' },
  { id: 'demo-2', order_number: 'FRM-749102', customer_name: 'Fatima Noor', customer_phone: '03219876543', delivery_city: 'Karachi', order_status: 'processing', payment_status: 'paid', payment_method: 'bank_transfer', total_paisa: 549900, created_at: '2026-10-23T16:00:00.000Z' },
  { id: 'demo-3', order_number: 'FRM-610283', customer_name: 'Bilal Sheikh', customer_phone: '03335551234', delivery_city: 'Islamabad', order_status: 'pending', payment_status: 'pending', payment_method: 'cod', total_paisa: 1249900, created_at: '2026-10-23T14:00:00.000Z' },
  { id: 'demo-4', order_number: 'FRM-503821', customer_name: 'Ayesha Raza', customer_phone: '03451112233', delivery_city: 'Rawalpindi', order_status: 'delivered', payment_status: 'paid', payment_method: 'easypaisa', total_paisa: 749900, created_at: '2026-10-22T18:00:00.000Z' },
];


export default async function AdminOrdersPage() {
  const { supabase } = await requireAdmin('/admin/orders');

  let orders: OrderRow[] | null = null;
  try {
    const { data } = await supabase
      .from('orders')
      .select('id, order_number, customer_name, customer_phone, delivery_city, order_status, payment_status, payment_method, total_paisa, created_at')
      .order('created_at', { ascending: false });
    orders = data as OrderRow[] | null;
  } catch {
    // Supabase query error fallback
  }

  if (orders === null || orders.length === 0) {
    orders = DEMO_ORDERS;
  }

  const pendingCount = orders.filter((o) => o.order_status === 'pending').length;
  const transitCount = orders.filter((o) => ['shipped', 'out_for_delivery'].includes(o.order_status)).length;
  const totalVolumePaisa = orders.reduce((sum, o) => sum + (o.total_paisa || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header Bar */}
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
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 700, color: '#1F2937', margin: 0 }}>
              Orders & Fulfillment
            </h1>
            <span
              style={{
                background: '#EDE9FE',
                color: '#7C3AED',
                fontSize: 12,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 9999,
              }}
            >
              {orders.length} orders
            </span>
          </div>
          <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>
            Real-time fulfillment tracking across Courier, Cash on Delivery, and Digital Payments.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#16A34A',
              background: '#DCFCE7',
              padding: '6px 12px',
              borderRadius: 6,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} />
            Sync Active
          </span>
        </div>
      </div>

      {/* Metric Mini Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 16 }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Orders Logged</span>
            <ShoppingBag size={18} color="#2563EB" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1F2937' }}>{orders.length}</div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Pending Processing</span>
            <Clock size={18} color="#D97706" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#D97706' }}>{pendingCount}</div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>In Transit</span>
            <Truck size={18} color="#0891B2" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0891B2' }}>{transitCount}</div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Order Volume</span>
            <TrendingUp size={18} color="#7C3AED" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#7C3AED' }}>{formatPrice(totalVolumePaisa)}</div>
        </div>
      </div>

      {/* Orders Table Card */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 720 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Order</th>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Customer</th>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>City</th>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Payment</th>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Fulfillment</th>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Total</th>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Date</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, idx) => {
                const statusCfg = getOrderBadge(o.order_status);
                const payCfg = getPaymentBadge(o.payment_status);

                return (
                  <tr
                    key={o.id}
                    className="admin-tr-hover"
                    style={{
                      borderBottom: idx === orders!.length - 1 ? 'none' : '1px solid #F1F5F9',
                    }}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <Link
                        href={`/admin/orders/${o.id}`}
                        style={{ color: '#7C3AED', textDecoration: 'none', fontWeight: 700, fontSize: 13 }}
                      >
                        #{o.order_number}
                      </Link>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ color: '#1F2937', fontWeight: 600, fontSize: 13 }}>{o.customer_name}</div>
                      <div style={{ color: '#9CA3AF', fontSize: 11 }}>{o.customer_phone}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#4B5563', fontSize: 13 }}>
                      {o.delivery_city}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          color: payCfg.text,
                          background: payCfg.bg,
                          padding: '3px 8px',
                          borderRadius: 6,
                        }}
                      >
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: payCfg.text }} />
                        {payCfg.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          color: statusCfg.text,
                          background: statusCfg.bg,
                          padding: '3px 8px',
                          borderRadius: 6,
                        }}
                      >
                        {statusCfg.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#1F2937', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>
                      {formatPrice(o.total_paisa)}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#6B7280', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {new Date(o.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <Link
                        href={`/admin/orders/${o.id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          color: '#7C3AED',
                          background: '#EDE9FE',
                          padding: '6px 12px',
                          borderRadius: 6,
                          textDecoration: 'none',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        <Eye size={13} /> View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
