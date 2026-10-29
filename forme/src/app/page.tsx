import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Truck, ShieldCheck, RefreshCw, CreditCard } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WelcomePopup from '@/components/storefront/WelcomePopup';
import ProductCard from '@/components/storefront/ProductCard';
import ChatWidget from '@/components/ai/ChatWidget';
import { BRAND } from '@/lib/config';
import { createClient } from '@/lib/supabase/server';
export const metadata: Metadata = {
  title: `${BRAND.name} — Premium Fashion & Streetwear in Pakistan`,
  description: `Shop the latest premium clothing, sneakers, and accessories at ${BRAND.name}. Free delivery on orders over Rs. 3,000. Cash on Delivery available across Pakistan.`,
};

// Demo seed products — will be replaced by Supabase data once configured
const SEED_PRODUCTS = [
  {
    id: '1',
    name: 'Oversized Premium Hoodie',
    slug: 'oversized-premium-hoodie',
    category: 'Clothing',
    image: '/product-clothing-1.jpg',
    basePricePaisa: 549900,
    salePricePaisa: null,
    isNew: true,
  },
  {
    id: '2',
    name: 'Minimal White Leather Sneaker',
    slug: 'minimal-white-leather-sneaker',
    category: 'Sneakers',
    image: '/product-sneaker-1.jpg',
    basePricePaisa: 899900,
    salePricePaisa: 749900,
    isNew: false,
  },
  {
    id: '3',
    name: 'Camel Wool-Blend Blazer',
    slug: 'camel-wool-blend-blazer',
    category: 'Clothing',
    image: '/product-jacket-1.jpg',
    basePricePaisa: 1249900,
    salePricePaisa: null,
    isNew: true,
  },
  {
    id: '4',
    name: 'High-Top Urban Boot',
    slug: 'high-top-urban-boot',
    category: 'Sneakers',
    image: '/product-sneaker-2.jpg',
    basePricePaisa: 1099900,
    salePricePaisa: 899900,
    isNew: false,
  },
  {
    id: '5',
    name: 'Essential Premium White Tee',
    slug: 'essential-premium-white-tee',
    category: 'Clothing',
    image: '/product-tshirt-1.jpg',
    basePricePaisa: 249900,
    salePricePaisa: null,
    isNew: true,
  },
  {
    id: '6',
    name: 'Chunky Runner Sneaker',
    slug: 'chunky-runner-sneaker',
    category: 'Sneakers',
    image: '/product-sneaker-1.jpg',
    basePricePaisa: 1299900,
    salePricePaisa: 999900,
    isNew: false,
  },
  {
    id: '7',
    name: 'Tailored Cargo Trousers',
    slug: 'tailored-cargo-trousers',
    category: 'Clothing',
    image: '/product-clothing-1.jpg',
    basePricePaisa: 649900,
    salePricePaisa: null,
    isNew: true,
  },
  {
    id: '8',
    name: 'Heritage Low-Top Sneaker',
    slug: 'heritage-low-top-sneaker',
    category: 'Sneakers',
    image: '/product-sneaker-2.jpg',
    basePricePaisa: 799900,
    salePricePaisa: null,
    isNew: false,
  },
];

const TRUST_FEATURES = [
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    desc: 'Free on orders over Rs. 3,000. Same-day dispatch on orders before 2 PM.',
  },
  {
    icon: CreditCard,
    title: 'Cash on Delivery',
    desc: 'Pay when your order arrives. No card required.',
  },
  {
    icon: RefreshCw,
    title: '7-Day Returns',
    desc: 'Not satisfied? Return within 7 days for a full exchange or credit note.',
  },
  {
    icon: ShieldCheck,
    title: '100% Authentic',
    desc: 'Every product is quality-checked and guaranteed authentic.',
  },
];

export default async function HomePage() {
  let products = SEED_PRODUCTS;
  try {
    const supabase = await createClient();
    const { data: dbProducts } = await supabase
      .from('products')
      .select('id, name, slug, base_price_paisa, sale_price_paisa, is_featured, categories(name), product_images(url, is_primary)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (dbProducts && dbProducts.length > 0) {
      products = dbProducts.map((p) => {
        const primaryImg = p.product_images?.find((img: { is_primary: boolean; url: string }) => img.is_primary)?.url ||
          p.product_images?.[0]?.url || '/product-clothing-1.jpg';
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.categories?.name || 'Clothing',
          image: primaryImg,
          basePricePaisa: p.base_price_paisa,
          salePricePaisa: p.sale_price_paisa,
          isNew: Boolean(p.is_featured),
        };
      });
    }
  } catch {
    // Supabase query fallback
  }

  const displayProducts = products.filter((p) => p.isNew).length > 0
    ? products.filter((p) => p.isNew).slice(0, 4)
    : products.slice(0, 4);

  return (
    <>
      <Header />

      <main id="main-content" tabIndex={-1}>
        {/* =============================================
            HERO SECTION
        ============================================= */}
        <section
          className="hero"
          aria-label="Hero banner"
          style={{ height: 'min(85vh, 780px)' }}
        >
          <div className="hero__media">
            <Image
              src="/hero-fashion.jpg"
              alt="FORME — Premium Fashion & Streetwear. Model wearing oversized hoodie, tailored cargo pants, and white sneakers."
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
            />
          </div>
          <div className="hero__overlay" aria-hidden="true" />

          <div className="hero__content container-wide h-full flex items-end pb-16 md:pb-24">
            <div style={{ maxWidth: 580 }}>
              <span
                className="label-caps animate-fade-in"
                style={{ color: 'rgba(255,255,255,0.75)', display: 'block', marginBottom: 16 }}
              >
                New Collection · Autumn 2026
              </span>
              <h1
                className="heading-display animate-slide-up"
                style={{ color: '#FFFFFF', marginBottom: 20 }}
              >
                Wear What You<br />Mean.
              </h1>
              <p
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: 16,
                  lineHeight: 1.6,
                  marginBottom: 32,
                  maxWidth: 420,
                }}
              >
                Premium streetwear and fashion, curated for the modern wardrobe.
                Delivered across Pakistan.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link
                  href="/collections/new-arrivals"
                  className="btn btn-primary btn-lg"
                  id="hero-shop-new"
                  style={{ textDecoration: 'none' }}
                >
                  Shop New Arrivals
                </Link>
                <Link
                  href="/collections/sneakers"
                  className="btn btn-lg"
                  id="hero-shop-sneakers"
                  style={{
                    textDecoration: 'none',
                    background: 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    border: '1.5px solid rgba(255,255,255,0.4)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  Explore Sneakers
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =============================================
            CATEGORY GRID
        ============================================= */}
        <section
          aria-labelledby="categories-heading"
          style={{ background: '#F4F1EB', padding: 'clamp(48px, 6vw, 96px) 0' }}
        >
          <div className="container-wide">
            <div className="section-header">
              <div>
                <span className="section-header__eyebrow">Collections</span>
                <h2 id="categories-heading" className="heading-xl">Shop by Category</h2>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16,
            }}>
              {/* Clothing */}
              <Link href="/collections/clothing" style={{ textDecoration: 'none' }} aria-label="Shop Clothing">
                <div className="category-card">
                  <Image
                    src="/category-clothing.jpg"
                    alt="FORME Clothing Collection — Hoodies, Blazers, T-shirts"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="category-card__overlay">
                    <span className="label-caps" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Collection</span>
                    <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>Clothing</h3>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 }}>Shop Now →</span>
                  </div>
                </div>
              </Link>

              {/* Sneakers */}
              <Link href="/collections/sneakers" style={{ textDecoration: 'none' }} aria-label="Shop Sneakers">
                <div className="category-card">
                  <Image
                    src="/category-sneakers.jpg"
                    alt="FORME Sneaker Collection — Premium Footwear"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="category-card__overlay">
                    <span className="label-caps" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Collection</span>
                    <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>Sneakers</h3>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 }}>Shop Now →</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* =============================================
            NEW ARRIVALS
        ============================================= */}
        <section
          aria-labelledby="new-arrivals-heading"
          style={{ background: '#FFFFFF', padding: 'clamp(48px, 6vw, 96px) 0' }}
        >
          <div className="container-wide">
            <div className="section-header">
              <div>
                <span className="section-header__eyebrow">Just Dropped</span>
                <h2 id="new-arrivals-heading" className="heading-xl">New Arrivals</h2>
              </div>
              <Link
                href="/collections/new-arrivals"
                className="btn-ghost label-caps"
                style={{ textDecoration: 'none', color: '#6B665F' }}
              >
                View All →
              </Link>
            </div>

            <div className="product-grid">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        {/* =============================================
            PROMOTIONAL CAMPAIGN BANNER
        ============================================= */}
        <section
          aria-label="Promotional campaign"
          style={{
            background: '#171717',
            padding: 'clamp(56px, 8vw, 112px) 0',
          }}
        >
          <div className="container-wide" style={{ textAlign: 'center' }}>
            <span className="label-caps" style={{ color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 16 }}>
              Limited Time
            </span>
            <h2 style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 700,
              color: '#F4F1EB',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: 20,
            }}>
              Sale Up to 30% Off<br />Selected Styles
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, marginBottom: 36 }}>
              Curated picks at unbeatable prices. While stocks last.
            </p>
            <Link
              href="/collections/sale"
              id="campaign-shop-sale"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '15px 36px',
                background: '#F4F1EB',
                color: '#171717',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
            >
              Shop the Sale
            </Link>
          </div>
        </section>

        {/* =============================================
            BEST SELLERS
        ============================================= */}
        <section
          aria-labelledby="bestsellers-heading"
          style={{ background: '#F4F1EB', padding: 'clamp(48px, 6vw, 96px) 0' }}
        >
          <div className="container-wide">
            <div className="section-header">
              <div>
                <span className="section-header__eyebrow">Most Popular</span>
                <h2 id="bestsellers-heading" className="heading-xl">Best Sellers</h2>
              </div>
              <Link
                href="/collections/all"
                className="btn-ghost label-caps"
                style={{ textDecoration: 'none', color: '#6B665F' }}
              >
                View All →
              </Link>
            </div>

            <div className="product-grid">
              {SEED_PRODUCTS.slice(0, 8).map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        {/* =============================================
            TRUST SECTION
        ============================================= */}
        <section
          aria-labelledby="trust-heading"
          style={{ background: '#FFFFFF', padding: 'clamp(48px, 6vw, 80px) 0', borderTop: '1px solid #D8D4CD' }}
        >
          <div className="container-wide">
            <h2 id="trust-heading" className="sr-only">Why Shop at FORME</h2>
            <div className="trust-grid">
              {TRUST_FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}
                  >
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: '#F4F1EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon size={22} style={{ color: '#171717' }} />
                    </div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#171717', letterSpacing: '0.03em' }}>{f.title}</h3>
                    <p style={{ fontSize: 13, color: '#6B665F', lineHeight: 1.55, maxWidth: 200 }}>{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WelcomePopup />
      <ChatWidget />
    </>
  );
}
