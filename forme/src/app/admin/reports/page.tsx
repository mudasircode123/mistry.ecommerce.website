import { BarChart3, TrendingUp, DollarSign, PackageCheck, MapPin } from 'lucide-react';
import { BRAND } from '@/lib/config';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/admin';

export const metadata: Metadata = { title: `Reports & Analytics — Admin — ${BRAND.name}` };

export default async function AdminReportsPage() {
  await requireAdmin('/admin/reports');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', letterSpacing: '-0.02em', margin: 0 }}>
            Sales & Business Reports
          </h1>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 4, margin: '4px 0 0' }}>
            Financial summaries, city-wise order volume, and category revenue performance.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{
            background: '#EDE9FE',
            color: '#7C3AED',
            padding: '6px 14px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}>
            <BarChart3 size={13} /> Real-time Analytics
          </span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 16 }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '24px', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Total Net Revenue</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#1F2937', marginTop: 10 }}>Rs. 1,485,000</div>
          <div style={{ fontSize: 12, color: '#16A34A', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
            <TrendingUp size={14} /> +18.4% compared to last month
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '24px', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Average Order Value (AOV)</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={18} />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#1F2937', marginTop: 10 }}>Rs. 8,420</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 8 }}>
            Across 176 completed shipments
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '24px', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>COD Delivery Success</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PackageCheck size={18} />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#16A34A', marginTop: 10 }}>94.2%</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 8 }}>
            Delivered & collected successfully nationwide
          </div>
        </div>
      </div>

      {/* City-wise Breakdown Card */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '24px', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: 0 }}>
            City-Wise Performance (Pakistan)
          </h3>
          <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>Top Metro Deliveries</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { city: 'Lahore', pct: 42, rev: 'Rs. 623,700' },
            { city: 'Karachi', pct: 31, rev: 'Rs. 460,350' },
            { city: 'Islamabad / Rawalpindi', pct: 18, rev: 'Rs. 267,300' },
            { city: 'Faisalabad & Multan', pct: 9, rev: 'Rs. 133,650' },
          ].map((c) => (
            <div key={c.city}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: '#1F2937', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={13} color="#7C3AED" />
                  {c.city}
                </span>
                <span style={{ color: '#4B5563', fontWeight: 600 }}>{c.rev} <span style={{ color: '#7C3AED', fontWeight: 700 }}>({c.pct}%)</span></span>
              </div>
              <div style={{ width: '100%', height: 8, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${c.pct}%`, height: '100%', background: 'linear-gradient(90deg, #7C3AED, #9333EA)', borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
