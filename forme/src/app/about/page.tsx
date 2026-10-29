import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BRAND } from '@/lib/config';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: `About Us — ${BRAND.name}`,
  description: `Learn about ${BRAND.name}, Pakistan's premier streetwear and elevated fashion house.`,
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main style={{ background: '#F4F1EB', minHeight: '80vh', paddingTop: 'calc(var(--announcement-height) + var(--header-height))' }}>
        <div style={{ background: '#171717', padding: 'clamp(40px, 6vw, 72px) 0', color: '#fff' }}>
          <div className="container-wide">
            <p style={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.14em', color: '#A3A3A3', marginBottom: 12 }}>Our Heritage & Vision</p>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em' }}>About {BRAND.name}</h1>
          </div>
        </div>
        <div className="container-wide" style={{ maxWidth: 800, padding: 'clamp(48px, 6vw, 80px) 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontSize: 16, lineHeight: 1.85, color: '#262626' }}>
            <p style={{ fontSize: 19, fontWeight: 500, color: '#171717', lineHeight: 1.6 }}>
              {BRAND.name} was founded with a singular purpose: to deliver world-class fashion, architectural silhouettes, and premium streetwear tailored specifically for Pakistan&apos;s style-forward generation.
            </p>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#171717', marginBottom: 12 }}>Uncompromising Quality</h2>
              <p>
                Every hoodie, tailored blazer, supima cotton tee, and sneaker in our collection is precision-crafted using heavyweights, full-grain leathers, and tailored textiles sourced directly from top-tier mills and artisan shoe workshops.
              </p>
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#171717', marginBottom: 12 }}>Nationwide Service</h2>
              <p>
                Headquartered in Lahore, we proudly provide secure nationwide Cash on Delivery and express shipping to Karachi, Islamabad, Rawalpindi, Peshawar, Quetta, Multan, Faisalabad, and beyond.
              </p>
            </div>
            <div style={{ paddingTop: 16 }}>
              <Link href="/collections/all" className="btn btn-primary" style={{ display: 'inline-flex', padding: '14px 28px', textDecoration: 'none' }}>
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
