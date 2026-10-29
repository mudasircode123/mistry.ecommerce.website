import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BRAND } from '@/lib/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Terms of Service — ${BRAND.name}`,
  description: `Terms and conditions governing orders and usage on ${BRAND.name}.`,
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main style={{ background: '#F4F1EB', minHeight: '80vh', paddingTop: 'calc(var(--announcement-height) + var(--header-height))' }}>
        <div style={{ background: '#171717', padding: 'clamp(40px, 6vw, 64px) 0', color: '#fff' }}>
          <div className="container-wide">
            <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800 }}>Terms of Service</h1>
            <p style={{ color: '#A3A3A3', fontSize: 13, marginTop: 8 }}>Last updated: October 2026</p>
          </div>
        </div>
        <div className="container-wide" style={{ maxWidth: 800, padding: 'clamp(40px, 5vw, 64px) 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: 15, lineHeight: 1.8, color: '#262626' }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#171717', marginBottom: 8 }}>1. Acceptance of Terms</h2>
              <p>By visiting or purchasing products from {BRAND.name}, you agree to abide by all conditions outlined herein. All products and prices are displayed in Pakistani Rupees (PKR).</p>
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#171717', marginBottom: 8 }}>2. Order Confirmation & Fulfillment</h2>
              <p>Orders placed via Cash on Delivery or digital payment are subject to verification and item availability. We reserve the right to cancel orders suspected of fraudulent intent or unreachable customer contact numbers.</p>
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#171717', marginBottom: 8 }}>3. Pricing & Currency</h2>
              <p>All prices quoted are in PKR and include applicable sales taxes unless otherwise noted. Delivery charges (if applicable) are shown transparently before order placement.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
