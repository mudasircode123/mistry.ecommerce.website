import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/storefront/ProductCard';
import ChatWidget from '@/components/ai/ChatWidget';
import { Search } from 'lucide-react';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" — Search — FORME` : 'Search — FORME',
  };
}

// Demo products — replace with Supabase full-text search
const ALL_PRODUCTS = [
  { id: '1', name: 'Oversized Premium Hoodie', slug: 'oversized-premium-hoodie', category: 'Clothing', image: '/product-clothing-1.jpg', basePricePaisa: 549900, salePricePaisa: null as null, isNew: true, keywords: 'hoodie sweatshirt oversized fleece streetwear comfort' },
  { id: '2', name: 'Minimal White Leather Sneaker', slug: 'minimal-white-leather-sneaker', category: 'Sneakers', image: '/product-sneaker-1.jpg', basePricePaisa: 899900, salePricePaisa: 749900 as number | null, isNew: false, keywords: 'sneaker white leather minimal clean shoe footwear' },
  { id: '3', name: 'Camel Wool-Blend Blazer', slug: 'camel-wool-blend-blazer', category: 'Clothing', image: '/product-jacket-1.jpg', basePricePaisa: 1249900, salePricePaisa: null as null, isNew: true, keywords: 'blazer jacket formal smart camel wool blend' },
  { id: '4', name: 'High-Top Urban Boot', slug: 'high-top-urban-boot', category: 'Sneakers', image: '/product-sneaker-2.jpg', basePricePaisa: 1099900, salePricePaisa: 899900 as number | null, isNew: false, keywords: 'boot high-top urban sneaker shoe streetwear' },
  { id: '5', name: 'Essential Premium White Tee', slug: 'essential-premium-white-tee', category: 'Clothing', image: '/product-tshirt-1.jpg', basePricePaisa: 249900, salePricePaisa: null as null, isNew: true, keywords: 't-shirt tee basic essentials white premium cotton' },
  { id: '6', name: 'Chunky Runner Sneaker', slug: 'chunky-runner-sneaker', category: 'Sneakers', image: '/product-sneaker-1.jpg', basePricePaisa: 1299900, salePricePaisa: 999900 as number | null, isNew: false, keywords: 'chunky runner sneaker bold streetwear shoe' },
  { id: '7', name: 'Tailored Cargo Trousers', slug: 'tailored-cargo-trousers', category: 'Clothing', image: '/product-clothing-1.jpg', basePricePaisa: 649900, salePricePaisa: null as null, isNew: true, keywords: 'cargo trousers pants tailored streetwear utility' },
  { id: '8', name: 'Heritage Low-Top Sneaker', slug: 'heritage-low-top-sneaker', category: 'Sneakers', image: '/product-sneaker-2.jpg', basePricePaisa: 799900, salePricePaisa: null as null, isNew: false, keywords: 'low-top heritage sneaker classic shoe leather' },
];

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';

  const results = query
    ? ALL_PRODUCTS.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.keywords.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <>
      <Header />
      <main id="main-content" style={{ background: '#F4F1EB', minHeight: '60vh', paddingTop: 'calc(var(--announcement-height) + var(--header-height))' }}>
        {/* Search Header */}
        <div style={{ background: '#171717', padding: 'clamp(32px, 5vw, 56px) 0', color: '#fff' }}>
          <div className="container-wide">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Search size={22} style={{ opacity: 0.7 }} />
              <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700 }}>
                {query ? `"${query}"` : 'Search'}
              </h1>
            </div>
            {query && (
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                {results.length} {results.length === 1 ? 'result' : 'results'} found
              </p>
            )}
          </div>
        </div>

        <div className="container-wide" style={{ padding: 'clamp(40px, 5vw, 64px) 24px' }}>
          {!query ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#6B665F' }}>
              <Search size={48} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
              <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>What are you looking for?</p>
              <p style={{ fontSize: 14 }}>Try searching for clothing, sneakers, or accessories.</p>
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#6B665F' }}>
              <Search size={48} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
              <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, color: '#171717' }}>No results for &ldquo;{query}&rdquo;</p>
              <p style={{ fontSize: 14, marginBottom: 28 }}>Try different keywords or browse our collections.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/collections/clothing" className="btn btn-outline" style={{ textDecoration: 'none', display: 'inline-flex' }}>Clothing</Link>
                <Link href="/collections/sneakers" className="btn btn-outline" style={{ textDecoration: 'none', display: 'inline-flex' }}>Sneakers</Link>
                <Link href="/collections/all" className="btn btn-outline" style={{ textDecoration: 'none', display: 'inline-flex' }}>All Products</Link>
              </div>
            </div>
          ) : (
            <div className="product-grid">
              {results.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  category={product.category}
                  image={product.image}
                  basePricePaisa={product.basePricePaisa}
                  salePricePaisa={product.salePricePaisa}
                  isNew={product.isNew}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
