import { Save, ShieldCheck, Store, Truck } from 'lucide-react';
import { BRAND } from '@/lib/config';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/admin';

export const metadata: Metadata = { title: `Platform Settings — Admin — ${BRAND.name}` };

export default async function AdminSettingsPage() {
  await requireAdmin('/admin/settings');

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', letterSpacing: '-0.02em', margin: 0 }}>
          Platform Settings
        </h1>
        <p style={{ color: '#6B7280', fontSize: 13, marginTop: 4, margin: '4px 0 0' }}>
          Store details, delivery fees, payment gateways, and security configurations.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Store Identity Card */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '24px', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, borderBottom: '1px solid #F3F4F6', paddingBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Store size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: 0 }}>Store Identity</h3>
              <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>Brand naming and public slogan</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Brand Name</label>
              <input
                type="text"
                defaultValue={BRAND.name}
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  color: '#1F2937',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Tagline / Slogan</label>
              <input
                type="text"
                defaultValue={BRAND.tagline}
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  color: '#1F2937',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>

        {/* Delivery & Logistics */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '24px', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, borderBottom: '1px solid #F3F4F6', paddingBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: 0 }}>Delivery & Thresholds</h3>
              <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>Shipping rates and free delivery incentives</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Standard Shipping Fee (PKR)</label>
              <input
                type="text"
                defaultValue="250"
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  color: '#1F2937',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Free Delivery Threshold (PKR)</label>
              <input
                type="text"
                defaultValue="3000"
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  color: '#1F2937',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>

        {/* Security & Access Overview */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '24px', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, borderBottom: '1px solid #F3F4F6', paddingBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: 0 }}>Security & Supabase Auth</h3>
              <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>Role-based server authorization & RLS enforcement</p>
            </div>
          </div>

          <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6 }}>
            <p style={{ margin: '0 0 10px' }}>
              • Admin access is validated securely on every request using <code>requireAdmin</code>.
            </p>
            <p style={{ margin: '0 0 10px' }}>
              • Service role keys remain server-side only; client session cookies are encrypted with Supabase Auth SSR.
            </p>
            <p style={{ margin: 0 }}>
              • Database tables have Row Level Security enabled for safe public catalog reads and authenticated order submissions.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#7C3AED',
              color: '#FFFFFF',
              padding: '11px 24px',
              borderRadius: 8,
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(124,58,237,0.25)'
            }}
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
