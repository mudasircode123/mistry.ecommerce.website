import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BRAND } from '@/lib/config';
import type { Metadata } from 'next';
import { Truck, ShieldCheck, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: `Shipping Policy — ${BRAND.name}`,
  description: `Shipping rates, delivery timelines, and Cash on Delivery details across Pakistan.`,
};

export default function ShippingPage() {
  return (
    <>
      <Header />
      <main style={{ background: '#F4F1EB', minHeight: '80vh', paddingTop: 'calc(var(--announcement-height) + var(--header-height))' }}>
        <div style={{ background: '#171717', padding: 'clamp(40px, 6vw, 64px) 0', color: '#fff' }}>
          <div className="container-wide">
            <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800 }}>Shipping & Delivery</h1>
            <p style={{ color: '#A3A3A3', fontSize: 13, marginTop: 8 }}>Reliable delivery to every postal code across Pakistan</p>
          </div>
        </div>
        <div className="container-wide" style={{ maxWidth: 800, padding: 'clamp(40px, 5vw, 64px) 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28, fontSize: 15, lineHeight: 1.8, color: '#262626' }}>
            <div style={{ background: '#fff', border: '1px solid #D8D4CD', padding: '24px', borderRadius: 8 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#171717', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Truck size={20} color="#171717" /> Delivery Rates & Free Threshold
              </h2>
              <p>Standard delivery across Pakistan is <strong>Rs. 250</strong>. Orders totaling <strong>Rs. 3,000 or more qualify for FREE Delivery</strong> automatically at checkout.</p>
            </div>
            <div style={{ background: '#fff', border: '1px solid #D8D4CD', padding: '24px', borderRadius: 8 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#171717', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={20} color="#171717" /> Estimated Delivery Time
              </h2>
              <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                <li><strong>Lahore, Karachi, Islamabad & Rawalpindi:</strong> 2 – 4 business days</li>
                <li><strong>Other Cities & Regional Towns:</strong> 3 – 6 business days</li>
              </ul>
            </div>
            <div style={{ background: '#fff', border: '1px solid #D8D4CD', padding: '24px', borderRadius: 8 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#171717', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={20} color="#171717" /> Cash on Delivery (COD)
              </h2>
              <p>Pay comfortably in cash upon receiving your parcel at your doorstep. Please ensure the exact payable amount is ready for the courier agent.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
