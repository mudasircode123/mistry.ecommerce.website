import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BRAND } from '@/lib/config';
import type { Metadata } from 'next';
import { Search } from 'lucide-react';

export const metadata: Metadata = {
  title: `Track Your Order — ${BRAND.name}`,
  description: `Live order tracking and delivery status for ${BRAND.name} orders.`,
};

export default function OrderTrackingPage() {
  return (
    <>
      <Header />
      <main style={{ background: '#F4F1EB', minHeight: '80vh', paddingTop: 'calc(var(--announcement-height) + var(--header-height))' }}>
        <div style={{ background: '#171717', padding: 'clamp(40px, 6vw, 64px) 0', color: '#fff' }}>
          <div className="container-wide">
            <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800 }}>Track Your Shipment</h1>
            <p style={{ color: '#A3A3A3', fontSize: 13, marginTop: 8 }}>Enter your order number or phone number to view live status</p>
          </div>
        </div>
        <div className="container-wide" style={{ maxWidth: 640, padding: 'clamp(40px, 5vw, 64px) 24px' }}>
          <div style={{ background: '#fff', border: '1px solid #D8D4CD', padding: '32px', borderRadius: 8 }}>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#171717', textTransform: 'uppercase', marginBottom: 8 }}>
                  Order Number or Tracking ID
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="e.g. FRM-882194 or 03001234567"
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #D8D4CD', borderRadius: 4, fontSize: 14 }}
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: 13, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
              >
                <Search size={16} /> Track Shipment Status
              </button>
            </form>

            <div style={{ borderTop: '1px solid #E5E7EB', marginTop: 28, paddingTop: 24, fontSize: 13, color: '#6B7280' }}>
              <div style={{ fontWeight: 600, color: '#111827', marginBottom: 8 }}>Courier Partners in Pakistan</div>
              <p>We ship through Leopards Courier, Trax, and TCS Logistics. Tracking links are also texted to your mobile number upon parcel dispatch.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
