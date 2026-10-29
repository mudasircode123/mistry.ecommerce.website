import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/storefront/ProductCard';
import ChatWidget from '@/components/ai/ChatWidget';
import CollectionFilters from '@/components/storefront/CollectionFilters';
import CollectionSort from '@/components/storefront/CollectionSort';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const COLLECTION_META: Record<string, { title: string; description: string }> = {
  'new-arrivals': {
    title: 'New Arrivals — FORME',
    description: 'Discover the latest additions to the FORME collection. Fresh drops in clothing and sneakers.',
  },
  clothing: {
    title: 'Clothing — FORME',
    description: 'Premium hoodies, t-shirts, blazers, and trousers. Shop the FORME clothing collection.',
  },
  sneakers: {
    title: 'Sneakers — FORME',
    description: 'Premium sneakers and footwear. From minimalist low-tops to chunky runners.',
  },
  accessories: {
    title: 'Accessories — FORME',
    description: 'Complete your look with FORME accessories. Bags, belts, and more.',
  },
  sale: {
    title: 'Sale — FORME',
    description: 'Shop FORME sale items. Up to 30% off selected clothing and sneakers.',
  },
  all: {
    title: 'All Products — FORME',
    description: 'Browse the complete FORME collection of premium fashion and streetwear.',
  },
};

// Demo products — replace with Supabase query
const ALL_PRODUCTS = [
  {
    id: '1', name: 'Oversized Premium Hoodie', slug: 'oversized-premium-hoodie',
    category: 'Clothing', image: '/product-clothing-1.jpg',
    basePricePaisa: 549900, salePricePaisa: null, isNew: true,
    tags: ['clothing', 'new-arrivals', 'all'],
  },
  {
    id: '2', name: 'Minimal White Leather Sneaker', slug: 'minimal-white-leather-sneaker',
    category: 'Sneakers', image: '/product-sneaker-1.jpg',
    basePricePaisa: 899900, salePricePaisa: 749900, isNew: false,
    tags: ['sneakers', 'sale', 'all'],
  },
  {
    id: '3', name: 'Camel Wool-Blend Blazer', slug: 'camel-wool-blend-blazer',
    category: 'Clothing', image: '/product-jacket-1.jpg',
    basePricePaisa: 1249900, salePricePaisa: null, isNew: true,
    tags: ['clothing', 'new-arrivals', 'all'],
  },
  {
    id: '4', name: 'High-Top Urban Boot', slug: 'high-top-urban-boot',
    category: 'Sneakers', image: '/product-sneaker-2.jpg',
    basePricePaisa: 1099900, salePricePaisa: 899900, isNew: false,
    tags: ['sneakers', 'sale', 'all'],
  },
  {
    id: '5', name: 'Essential Premium White Tee', slug: 'essential-premium-white-tee',
    category: 'Clothing', image: '/product-tshirt-1.jpg',
    basePricePaisa: 249900, salePricePaisa: null, isNew: true,
    tags: ['clothing', 'new-arrivals', 'all'],
  },
  {
    id: '6', name: 'Chunky Runner Sneaker', slug: 'chunky-runner-sneaker',
    category: 'Sneakers', image: '/product-sneaker-1.jpg',
    basePricePaisa: 1299900, salePricePaisa: 999900, isNew: false,
    tags: ['sneakers', 'sale', 'all'],
  },
  {
    id: '7', name: 'Tailored Cargo Trousers', slug: 'tailored-cargo-trousers',
    category: 'Clothing', image: '/product-clothing-1.jpg',
    basePricePaisa: 649900, salePricePaisa: null, isNew: true,
    tags: ['clothing', 'new-arrivals', 'all'],
  },
  {
    id: '8', name: 'Heritage Low-Top Sneaker', slug: 'heritage-low-top-sneaker',
    category: 'Sneakers', image: '/product-sneaker-2.jpg',
    basePricePaisa: 799900, salePricePaisa: null, isNew: false,
    tags: ['sneakers', 'all'],
  },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = COLLECTION_META[slug] ?? {
    title: `${slug.replace(/-/g, ' ')} — FORME`,
    description: `Shop FORME ${slug.replace(/-/g, ' ')} collection.`,
  };
  return meta;
}

import { createClient } from '@/lib/supabase/server';

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const sortBy = (sp.sort as string) ?? 'newest';

  let products = ALL_PRODUCTS.filter((p) =>
    slug === 'all' ? true : p.tags.includes(slug)
  );

  try {
    const supabase = await createClient();
    const { data: dbProducts } = await supabase
      .from('products')
      .select('id, name, slug, base_price_paisa, sale_price_paisa, is_featured, tags, categories(name, slug), product_images(url, is_primary)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (dbProducts && dbProducts.length > 0) {
      const mapped = dbProducts.map((p) => {
        const catSlug = p.categories?.slug || 'clothing';
        const itemTags = Array.isArray(p.tags) ? p.tags.map(String) : [];
        const allTags = [...itemTags, catSlug, 'all'];
        if (p.is_featured) allTags.push('new-arrivals');
        if (p.sale_price_paisa && p.sale_price_paisa < p.base_price_paisa) allTags.push('sale');

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
          tags: allTags,
        };
      });

      const filtered = mapped.filter((p) =>
        slug === 'all' ? true : p.tags.includes(slug)
      );

      if (filtered.length > 0) {
        products = filtered;
      }
    }
  } catch {
    // fallback
  }

  // Sort
  if (sortBy === 'price-asc') {
    products = [...products].sort((a, b) => a.basePricePaisa - b.basePricePaisa);
  } else if (sortBy === 'price-desc') {
    products = [...products].sort((a, b) => b.basePricePaisa - a.basePricePaisa);
  }

  const collectionTitle = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {/* Collection Header */}
        <div style={{ background: '#F4F1EB', padding: '48px 0 0', borderBottom: '1px solid #D8D4CD' }}>
          <div className="container-wide">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="breadcrumb" style={{ marginBottom: 20 }}>
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{collectionTitle}</span>
            </nav>

            <h1 className="heading-xl" style={{ marginBottom: 24 }}>{collectionTitle}</h1>

            {/* Sort bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 20,
              flexWrap: 'wrap',
              gap: 12,
            }}>
              <p style={{ fontSize: 13, color: '#6B665F' }}>
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
              <CollectionSort defaultValue={sortBy} />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div style={{ background: '#FFFFFF', padding: 'clamp(32px, 4vw, 64px) 0' }}>
          <div className="container-wide">
            <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
              {/* Filters sidebar */}
              <CollectionFilters />

              {/* Grid */}
              <div style={{ flex: 1 }}>
                {products.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '64px 0', color: '#6B665F' }}>
                    <p style={{ fontSize: 16, marginBottom: 16 }}>No products found in this collection.</p>
                    <Link href="/collections/all" className="btn btn-outline" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                      View All Products
                    </Link>
                  </div>
                ) : (
                  <div className="product-grid">
                    {products.map((product) => (
                      <ProductCard key={product.id} {...product} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
