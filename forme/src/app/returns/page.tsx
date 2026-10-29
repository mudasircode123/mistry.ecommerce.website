import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BRAND } from '@/lib/config';
import type { Metadata } from 'next';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: `Returns & Exchanges — ${BRAND.name}`,
  description: `Easy 7-day returns and size exchanges at ${BRAND.name}.`,
};

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main style={{ background: '#F4F1EB', minHeight: '80vh', paddingTop: 'calc(var(--announcement-height) + var(--header-height))' }}>
        <div style={{ background: '#171717', padding: 'clamp(40px, 6vw, 64px) 0', color: '#fff' }}>
          <div className="container-wide">
            <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800 }}>Returns & Exchanges</h1>
            <p style={{ color: '#A3A3A3', fontSize: 13, marginTop: 8 }}>Hassle-free 7-day policy for unworn items with original tags</p>
          </div>
        </div>
        <div className="container-wide" style={{ maxWidth: 800, padding: 'clamp(40px, 5vw, 64px) 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: 15, lineHeight: 1.8, color: '#262626' }}>
            <div style={{ background: '#fff', border: '1px solid #D8D4CD', padding: '24px', borderRadius: 8 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#171717', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RefreshCw size={20} color="#171717" /> 7-Day Easy Exchange Policy
              </h2>
              <p>
                If your clothing or shoe size isn&apos;t a perfect fit, you can request an exchange within 7 days of parcel delivery. The item must be unused, unwashed, and in its original packaging with tags intact.
              </p>
            </div>
            <div style={{ background: '#fff', border: '1px solid #D8D4CD', padding: '24px', borderRadius: 8 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#171717', marginBottom: 8 }}>How to Request an Exchange</h2>
              <ol style={{ paddingLeft: 20, marginTop: 8 }}>
                <li>Head to our <Link href="/contact" style={{ color: '#171717', fontWeight: 600, textDecoration: 'underline' }}>Contact Form</Link> or WhatsApp customer support at {BRAND.contactPhone}.</li>
                <li>Provide your order number (e.g. FRM-882194) and desired replacement size or product.</li>
                <li>Our reverse courier will pick up the parcel from your address and dispatch your new size.</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
