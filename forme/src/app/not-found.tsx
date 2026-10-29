import Link from 'next/link';
import { Home } from 'lucide-react';
import { BRAND } from '@/lib/config';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#F4F1EB', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#171717', padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Link href="/" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 900, fontSize: 22, letterSpacing: '0.18em', color: '#F4F1EB', textDecoration: 'none' }}>
            {BRAND.name}
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px' }}>
        <p style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: 'clamp(80px, 15vw, 160px)', fontWeight: 900, letterSpacing: '-0.04em', color: '#D8D4CD', lineHeight: 1, marginBottom: 8 }}>
          404
        </p>
        <h1 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700, color: '#171717', marginBottom: 16 }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: 15, color: '#6B665F', maxWidth: 360, lineHeight: 1.7, marginBottom: 40 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#171717', color: '#fff', padding: '12px 24px', textDecoration: 'none', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em' }}>
            <Home size={16} /> Go Home
          </Link>
          <Link href="/collections/all" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid #171717', color: '#171717', padding: '12px 24px', textDecoration: 'none', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em' }}>
            Shop All Products
          </Link>
        </div>
      </main>
    </div>
  );
}
