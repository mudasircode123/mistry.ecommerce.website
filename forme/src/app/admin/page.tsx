import Link from 'next/link';
import {
  ShoppingBag,
  Truck, AlertTriangle, TrendingUp,
  Clock, CheckCircle, XCircle, MessageSquare, Plus, ArrowUpRight
} from 'lucide-react';
import { BRAND, formatPrice } from '@/lib/config';
import { getOrderBadge } from '@/lib/admin/statusBadges';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/admin';

export const metadata: Metadata = {
  title: `Admin Dashboard — ${BRAND.name}`,
};

interface RecentOrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  order_status: string;
  payment_status: string;
  total_paisa: number;
  created_at: string;
}

interface LowStockVariantRow {
  id: string;
  size: string;
  color: string;
  stock_quantity: number;
  product_id?: string;
}

const DEMO_RECENT_ORDERS: RecentOrderRow[] = [
  { id: 'demo-1', order_number: 'FRM-882194', customer_name: 'Hamza Tariq', order_status: 'shipped', payment_status: 'paid', total_paisa: 899900, created_at: '2026-10-23T17:00:00.000Z' },
  { id: 'demo-2', order_number: 'FRM-749102', customer_name: 'Fatima Noor', order_status: 'processing', payment_status: 'paid', total_paisa: 549900, created_at: '2026-10-23T16:00:00.000Z' },
  { id: 'demo-3', order_number: 'FRM-610283', customer_name: 'Bilal Sheikh', order_status: 'pending', payment_status: 'pending', total_paisa: 1249900, created_at: '2026-10-23T14:00:00.000Z' },
  { id: 'demo-4', order_number: 'FRM-503821', customer_name: 'Ayesha Raza', order_status: 'delivered', payment_status: 'paid', total_paisa: 749900, created_at: '2026-10-22T18:00:00.000Z' },
];

const DEMO_LOW_STOCK: LowStockVariantRow[] = [
  { id: 'v1', size: 'XL', color: 'Jet Black', stock_quantity: 0 },
  { id: 'v2', size: '44', color: 'White', stock_quantity: 0 },
  { id: 'v3', size: 'XS', color: 'Camel', stock_quantity: 2 },
];




export default async function AdminDashboard() {
  const { supabase, isDemo } = await requireAdmin('/admin');

  // Stats
  let totalOrders = 0;
  let pendingOrders = 0;
  let shippedOrders = 0;
  let recentOrders: RecentOrderRow[] | null = null;
  let lowStockVariants: LowStockVariantRow[] | null = null;
  let totalRevenuePaisa = 0;
  let totalInquiries = 0;

  try {
    const [
      { count: tCount },
      { count: pCount },
      { count: sCount },
      { data: rOrders },
      { data: lVariants },
      { data: revData },
      { count: inqCount },
    ] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('order_status', 'pending'),
      supabase.from('orders').select('*', { count: 'exact', head: true }).in('order_status', ['shipped', 'out_for_delivery']),
      supabase.from('orders').select('id, order_number, customer_name, order_status, payment_status, total_paisa, created_at').order('created_at', { ascending: false }).limit(10),
      supabase.from('product_variants').select('id, size, color, stock_quantity, product_id').lt('stock_quantity', 5).eq('is_available', true).limit(10),
      supabase.from('orders').select('total_paisa').eq('payment_status', 'paid'),
      supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    ]);

    totalOrders = tCount ?? 0;
    pendingOrders = pCount ?? 0;
    shippedOrders = sCount ?? 0;
    recentOrders = rOrders as RecentOrderRow[] | null;
    lowStockVariants = lVariants as LowStockVariantRow[] | null;
    totalRevenuePaisa = revData?.reduce((s, o) => s + (o.total_paisa ?? 0), 0) ?? 0;
    totalInquiries = inqCount ?? 0;
  } catch {
    // Supabase query error fallback
  }

  // Populate realistic demo data if running in demo mode or empty database
  if (isDemo || (!totalOrders && (!recentOrders || recentOrders.length === 0))) {
    totalOrders = totalOrders || 48;
    pendingOrders = pendingOrders || 5;
    shippedOrders = shippedOrders || 14;
    totalRevenuePaisa = totalRevenuePaisa || 38450000;
    recentOrders = recentOrders && recentOrders.length > 0 ? recentOrders : DEMO_RECENT_ORDERS;
    lowStockVariants = lowStockVariants && lowStockVariants.length > 0 ? lowStockVariants : DEMO_LOW_STOCK;
  }

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
              Analytics & Overview
            </h1>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: '#DCFCE7',
                color: '#16A34A',
                fontSize: 11,
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: 9999,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} />
              Live Sync
            </span>
          </div>
          <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>
            {new Date().toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Link
            href="/admin/products/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#7C3AED',
              color: '#FFFFFF',
              fontSize: 13,
              fontWeight: 600,
              padding: '9px 16px',
              borderRadius: 8,
              textDecoration: 'none',
              boxShadow: '0 1px 2px rgba(124, 58, 237, 0.2)',
            }}
          >
            <Plus size={16} /> Add Product
          </Link>
          <Link
            href="/admin/orders"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#FFFFFF',
              color: '#1F2937',
              border: '1px solid #E5E7EB',
              fontSize: 13,
              fontWeight: 600,
              padding: '9px 16px',
              borderRadius: 8,
              textDecoration: 'none',
            }}
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: 16,
        }}
      >
        {[
          {
            label: 'Total Revenue',
            value: formatPrice(totalRevenuePaisa),
            subtext: 'Paid customer orders',
            icon: TrendingUp,
            iconColor: '#7C3AED',
            iconBg: '#EDE9FE',
            borderAccent: '#7C3AED',
          },
          {
            label: 'Total Orders',
            value: totalOrders.toLocaleString(),
            subtext: 'All recorded purchases',
            icon: ShoppingBag,
            iconColor: '#2563EB',
            iconBg: '#DBEAFE',
            borderAccent: '#2563EB',
          },
          {
            label: 'Pending Orders',
            value: pendingOrders.toLocaleString(),
            subtext: 'Awaiting fulfillment',
            icon: Clock,
            iconColor: '#D97706',
            iconBg: '#FEF3C7',
            borderAccent: '#D97706',
          },
          {
            label: 'Orders in Transit',
            value: shippedOrders.toLocaleString(),
            subtext: 'Dispatched with courier',
            icon: Truck,
            iconColor: '#0891B2',
            iconBg: '#CFFAFE',
            borderAccent: '#0891B2',
          },
          {
            label: 'Customer Inquiries',
            value: totalInquiries.toLocaleString(),
            subtext: 'Support & inquiries',
            icon: MessageSquare,
            iconColor: '#9333EA',
            iconBg: '#F3E8FF',
            borderAccent: '#9333EA',
          },
        ].map(({ label, value, subtext, icon: Icon, iconColor, iconBg }) => (
          <div
            key={label}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 12,
              padding: '20px 22px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {label}
              </span>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={18} color={iconColor} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'clamp(22px, 2.5vw, 26px)', fontWeight: 800, color: '#1F2937', marginBottom: 4, letterSpacing: '-0.02em' }}>
                {value}
              </div>
              <p style={{ margin: 0, fontSize: 12, color: '#9CA3AF' }}>{subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStockVariants && lowStockVariants.length > 0 && (
        <div
          style={{
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: 12,
            padding: '18px 24px',
            boxShadow: '0 1px 3px rgba(217, 119, 6, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#92400E', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
              <AlertTriangle size={18} color="#D97706" />
              Low Stock Warning ({lowStockVariants.length} variant{lowStockVariants.length !== 1 ? 's' : ''} require attention)
            </h2>
            <Link
              href="/admin/products"
              style={{ fontSize: 12, fontWeight: 600, color: '#B45309', textDecoration: 'none' }}
            >
              Manage Inventory →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 10 }}>
            {lowStockVariants.map((v) => (
              <div
                key={v.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #FDE68A',
                  borderRadius: 8,
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 13,
                }}
              >
                <span style={{ color: '#1F2937', fontWeight: 500 }}>
                  {[v.size, v.color].filter(Boolean).join(' · ') || 'Default Variant'}
                </span>
                <span
                  style={{
                    color: v.stock_quantity === 0 ? '#DC2626' : '#D97706',
                    fontWeight: 700,
                    fontSize: 12,
                    background: v.stock_quantity === 0 ? '#FEE2E2' : '#FEF3C7',
                    padding: '2px 8px',
                    borderRadius: 6,
                  }}
                >
                  {v.stock_quantity === 0 ? 'Out of stock' : `${v.stock_quantity} remaining`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Card */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: 0 }}>Recent Orders</h2>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6B7280' }}>
              Latest customer purchases across Pakistan
            </p>
          </div>
          <Link
            href="/admin/orders"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#7C3AED',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>View All Orders</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {!recentOrders || recentOrders.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#6B7280' }}>
            <ShoppingBag size={36} style={{ margin: '0 auto 12px', color: '#9CA3AF' }} />
            <p style={{ fontSize: 14, margin: 0 }}>No orders recorded yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 640 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Order Number</th>
                  <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Customer</th>
                  <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Date</th>
                  <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Payment</th>
                  <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => {
                  const statusCfg = getOrderBadge(order.order_status);

                  return (
                    <tr
                      key={order.id}
                      className="admin-tr-hover"
                      style={{
                        borderBottom: idx === recentOrders!.length - 1 ? 'none' : '1px solid #F1F5F9',
                      }}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          style={{ color: '#7C3AED', textDecoration: 'none', fontWeight: 700, fontSize: 13 }}
                        >
                          #{order.order_number}
                        </Link>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#1F2937', fontWeight: 500, fontSize: 13 }}>
                        {order.customer_name}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#6B7280', fontSize: 12 }}>
                        {new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: statusCfg.bg,
                            color: statusCfg.text,
                            padding: '3px 10px',
                            borderRadius: 9999,
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {statusCfg.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                          {order.payment_status === 'paid' ? (
                            <>
                              <CheckCircle size={13} style={{ color: '#16A34A' }} />
                              <span style={{ color: '#16A34A', fontWeight: 600 }}>Paid</span>
                            </>
                          ) : order.payment_status === 'failed' ? (
                            <>
                              <XCircle size={13} style={{ color: '#DC2626' }} />
                              <span style={{ color: '#DC2626', fontWeight: 600 }}>Failed</span>
                            </>
                          ) : (
                            <>
                              <Clock size={13} style={{ color: '#D97706' }} />
                              <span style={{ color: '#D97706', fontWeight: 600 }}>Pending</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#1F2937', fontWeight: 700, fontSize: 13, textAlign: 'right' }}>
                        {formatPrice(order.total_paisa)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
