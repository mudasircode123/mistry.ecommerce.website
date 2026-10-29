import { Plus } from 'lucide-react';
import { BRAND } from '@/lib/config';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/admin';

export const metadata: Metadata = { title: `Coupons — Admin — ${BRAND.name}` };

const DEMO_COUPONS = [
  { id: 'cp1', code: 'WELCOME10', discount: '10% OFF', min_order: 'Rs. 2,000', usage_count: 142, status: 'Active' },
  { id: 'cp2', code: 'FORME15', discount: '15% OFF', min_order: 'Rs. 5,000', usage_count: 89, status: 'Active' },
  { id: 'cp3', code: 'FREESHIP', discount: 'Free Delivery', min_order: 'Rs. 3,000', usage_count: 310, status: 'Active' },
  { id: 'cp4', code: 'FLASH25', discount: '25% OFF', min_order: 'Rs. 8,000', usage_count: 55, status: 'Expired' },
];

export default async function AdminCouponsPage() {
  await requireAdmin('/admin/coupons');

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
              Discount Coupons
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
              {DEMO_COUPONS.length} promotional rules
            </span>
          </div>
          <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>
            Manage voucher codes, minimum order requirements, and discount rates for checkout.
          </p>
        </div>

        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#7C3AED',
            color: '#FFFFFF',
            padding: '10px 18px',
            borderRadius: 8,
            border: 'none',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(124, 58, 237, 0.2)',
          }}
        >
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {/* Table Card */}
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
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 640 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Promo Code</th>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Discount</th>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Minimum Order</th>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Redemptions</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_COUPONS.map((cp, idx) => (
                <tr
                  key={cp.id}
                  className="admin-tr-hover"
                  style={{
                    borderBottom: idx === DEMO_COUPONS.length - 1 ? 'none' : '1px solid #F1F5F9',
                  }}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: 13,
                        color: '#7C3AED',
                        background: '#EDE9FE',
                        padding: '4px 10px',
                        borderRadius: 6,
                        border: '1px solid #DDD6FE',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {cp.code}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1F2937', fontSize: 13 }}>
                    {cp.discount}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#4B5563', fontSize: 13 }}>
                    {cp.min_order}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#1F2937', fontWeight: 600, fontSize: 13 }}>
                    {cp.usage_count.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: 9999,
                        background: cp.status === 'Active' ? '#DCFCE7' : '#F3F4F6',
                        color: cp.status === 'Active' ? '#16A34A' : '#6B7280',
                      }}
                    >
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cp.status === 'Active' ? '#16A34A' : '#9CA3AF' }} />
                      {cp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
