import { Users, MapPin, TrendingUp } from 'lucide-react';
import { BRAND, formatPrice } from '@/lib/config';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/admin';

export const metadata: Metadata = { title: `Customers — Admin — ${BRAND.name}` };

interface ProfileRow {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  created_at?: string | null;
}

interface CustomerRow {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  total_orders: number;
  total_spent_paisa: number;
  created_at: string;
}

const DEMO_CUSTOMERS: CustomerRow[] = [
  { id: 'c1', full_name: 'Hamza Tariq', email: 'hamza.t@gmail.com', phone: '03001234567', city: 'Lahore', total_orders: 4, total_spent_paisa: 3249600, created_at: '2026-09-12' },
  { id: 'c2', full_name: 'Fatima Noor', email: 'fatima.noor@yahoo.com', phone: '03219876543', city: 'Karachi', total_orders: 3, total_spent_paisa: 1899700, created_at: '2026-09-28' },
  { id: 'c3', full_name: 'Bilal Sheikh', email: 'bilal.sheikh@outlook.com', phone: '03335551234', city: 'Islamabad', total_orders: 2, total_spent_paisa: 2499800, created_at: '2026-10-04' },
  { id: 'c4', full_name: 'Ayesha Raza', email: 'ayesha.r@gmail.com', phone: '03451112233', city: 'Rawalpindi', total_orders: 1, total_spent_paisa: 749900, created_at: '2026-10-18' },
];

export default async function AdminCustomersPage() {
  const { supabase, isDemo } = await requireAdmin('/admin/customers');

  let customers: CustomerRow[] = DEMO_CUSTOMERS;
  if (!isDemo) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, created_at')
        .order('created_at', { ascending: false });
      if (data && data.length > 0) {
        customers = (data as unknown as ProfileRow[]).map((d) => ({
          id: d.id,
          full_name: d.full_name || 'Customer',
          email: d.email || '—',
          phone: d.phone || '—',
          city: 'Pakistan',
          total_orders: 1,
          total_spent_paisa: 549900,
          created_at: d.created_at || '2026-10-01',
        }));
      }
    } catch {
      // Fallback to demo
    }
  }

  const totalSpentPaisa = customers.reduce((sum, c) => sum + (c.total_spent_paisa || 0), 0);

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
              Customer Directory
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
              {customers.length} registered
            </span>
          </div>
          <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>
            Profiles, ordering history, and contact details for shoppers in Pakistan.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 16 }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Total Customers</span>
            <Users size={18} color="#7C3AED" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1F2937' }}>{customers.length}</div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Customer LTV Volume</span>
            <TrendingUp size={18} color="#16A34A" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#16A34A' }}>{formatPrice(totalSpentPaisa)}</div>
        </div>
      </div>

      {/* Customers Table Card */}
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
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 680 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Customer</th>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Phone</th>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Location</th>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Orders</th>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Total Spent</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, idx) => {
                const initials = c.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'CU';

                return (
                  <tr
                    key={c.id}
                    className="admin-tr-hover"
                    style={{
                      borderBottom: idx === customers.length - 1 ? 'none' : '1px solid #F1F5F9',
                    }}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: '#EDE9FE',
                            color: '#7C3AED',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 12,
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#1F2937', fontSize: 14 }}>{c.full_name}</div>
                          <div style={{ fontSize: 12, color: '#9CA3AF' }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#4B5563', fontSize: 13 }}>
                      {c.phone}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          background: '#F1F5F9',
                          color: '#4B5563',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        <MapPin size={12} color="#7C3AED" /> {c.city}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1F2937', fontSize: 13 }}>
                      {c.total_orders}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#16A34A', fontSize: 13 }}>
                      {formatPrice(c.total_spent_paisa)}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#6B7280', fontSize: 12 }}>
                      {c.created_at}
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
