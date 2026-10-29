import { Plus, MapPin, Phone, Building2 } from 'lucide-react';
import { BRAND } from '@/lib/config';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/admin';

export const metadata: Metadata = { title: `Suppliers & Sourcing — Admin — ${BRAND.name}` };

const DEMO_SUPPLIERS = [
  { id: 'sup1', name: 'Al-Karam Textile Mills', contact: 'M. Kashif', phone: '042-35891122', city: 'Faisalabad', category: 'Heavyweight Fleece & Tees', active_skus: 12 },
  { id: 'sup2', name: 'Apex Footwear Crafts', contact: 'Rizwan Ahmed', phone: '042-37124455', city: 'Lahore', category: 'Leather Sneakers & Boots', active_skus: 8 },
  { id: 'sup3', name: 'Crescent Woolens Ltd', contact: 'Sohail Butt', phone: '051-2244889', city: 'Gujranwala', category: 'Blazers & Woolen Garments', active_skus: 4 },
];

export default async function AdminSuppliersPage() {
  await requireAdmin('/admin/suppliers');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', letterSpacing: '-0.02em', margin: 0 }}>
            Suppliers & Sourcing
          </h1>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 4, margin: '4px 0 0' }}>
            Local manufacturing partners, fabric mills, and artisan workshops across Pakistan.
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
            boxShadow: '0 1px 3px rgba(124,58,237,0.3)'
          }}
        >
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 16 }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Mills & Vendors</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#1F2937', marginTop: 4 }}>{DEMO_SUPPLIERS.length}</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Sourced SKUs</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#7C3AED', marginTop: 4 }}>24</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hub Locations</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#16A34A', marginTop: 4 }}>3 Cities</div>
        </div>
      </div>

      {/* Suppliers Table */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
          <table style={{ width: '100%', minWidth: 640, borderCollapse: 'collapse', textAlign: 'left', fontSize: 13, color: '#374151' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB', color: '#6B7280', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.05em', fontWeight: 700 }}>
                <th style={{ padding: '14px 20px' }}>Supplier / Mill</th>
                <th style={{ padding: '14px 20px' }}>Contact Person</th>
                <th style={{ padding: '14px 20px' }}>Location</th>
                <th style={{ padding: '14px 20px' }}>Material / Category</th>
                <th style={{ padding: '14px 20px' }}>Active SKUs</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_SUPPLIERS.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#1F2937' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building2 size={16} />
                      </div>
                      <span>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 600, color: '#1F2937' }}>{s.contact}</div>
                    <div style={{ fontSize: 12, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <Phone size={11} /> {s.phone}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#F1F5F9', color: '#475569', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
                      <MapPin size={12} color="#7C3AED" /> {s.city}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#4B5563' }}>{s.category}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontWeight: 700, color: '#7C3AED', background: '#EDE9FE', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
                      {s.active_skus} SKUs
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
