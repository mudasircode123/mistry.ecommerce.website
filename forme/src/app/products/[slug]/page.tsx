import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/ai/ChatWidget';
import ProductDetail from '@/components/storefront/ProductDetail';
import ProductCard from '@/components/storefront/ProductCard';
import { createClient } from '@/lib/supabase/server';

interface Props {
  params: Promise<{ slug: string }>;
}

export interface DetailedProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  images: string[];
  basePricePaisa: number;
  salePricePaisa: number | null;
  isNew: boolean;
  sku: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: Record<string, number>;
}

const SEED_CATALOG: Record<string, DetailedProduct> = {
  'oversized-premium-hoodie': {
    id: '1',
    name: 'Oversized Premium Hoodie',
    slug: 'oversized-premium-hoodie',
    category: 'Clothing',
    sku: 'FRM-HOD-001',
    description: 'Crafted from 380gsm heavyweight fleece cotton, our Oversized Premium Hoodie is designed for effortless comfort and elevated street style. Features a relaxed silhouette, kangaroo pocket, and ribbed cuffs. Machine washable.',
    images: ['/product-clothing-1.jpg'],
    basePricePaisa: 549900,
    salePricePaisa: null,
    isNew: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Jet Black', hex: '#171717' },
      { name: 'Stone Grey', hex: '#9ca3af' },
      { name: 'Cream', hex: '#fef3c7' },
    ],
    stock: {
      'XS-Jet Black': 5, 'S-Jet Black': 12, 'M-Jet Black': 8, 'L-Jet Black': 3, 'XL-Jet Black': 0, 'XXL-Jet Black': 2,
      'XS-Stone Grey': 4, 'S-Stone Grey': 8, 'M-Stone Grey': 6, 'L-Stone Grey': 2, 'XL-Stone Grey': 1, 'XXL-Stone Grey': 1,
      'XS-Cream': 3, 'S-Cream': 6, 'M-Cream': 4, 'L-Cream': 2, 'XL-Cream': 1, 'XXL-Cream': 0,
    },
  },
  'minimal-white-leather-sneaker': {
    id: '2',
    name: 'Minimal White Leather Sneaker',
    slug: 'minimal-white-leather-sneaker',
    category: 'Sneakers',
    sku: 'FRM-SNK-001',
    description: 'Premium full-grain leather upper with an ultra-clean minimal design. Cushioned leather insole and vulcanised rubber sole for lasting comfort. The essential wardrobe sneaker.',
    images: ['/product-sneaker-1.jpg'],
    basePricePaisa: 899900,
    salePricePaisa: 749900,
    isNew: false,
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    colors: [{ name: 'White', hex: '#FFFFFF' }],
    stock: { '39-White': 4, '40-White': 6, '41-White': 8, '42-White': 5, '43-White': 2, '44-White': 0, '45-White': 1 },
  },
  'camel-wool-blend-blazer': {
    id: '3',
    name: 'Camel Wool-Blend Blazer',
    slug: 'camel-wool-blend-blazer',
    category: 'Clothing',
    sku: 'FRM-BLZ-001',
    description: 'A sophisticated double-breasted blazer in a warm camel tone. Made from a premium wool-blend fabric with a structured silhouette and notched lapel. Perfect for smart-casual and formal occasions.',
    images: ['/product-jacket-1.jpg'],
    basePricePaisa: 1249900,
    salePricePaisa: null,
    isNew: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Camel', hex: '#C19A6B' }],
    stock: { 'XS-Camel': 2, 'S-Camel': 5, 'M-Camel': 7, 'L-Camel': 4, 'XL-Camel': 1 },
  },
  'high-top-urban-boot': {
    id: '4',
    name: 'High-Top Urban Boot',
    slug: 'high-top-urban-boot',
    category: 'Sneakers',
    sku: 'FRM-BOT-001',
    description: 'Engineered for street utility with weather-resistant treated leather, high-profile ankle padding, and rugged grip tread. Handcrafted for exceptional durability.',
    images: ['/product-sneaker-2.jpg'],
    basePricePaisa: 1099900,
    salePricePaisa: 899900,
    isNew: false,
    sizes: ['40', '41', '42', '43', '44'],
    colors: [{ name: 'Matte Black', hex: '#111111' }],
    stock: { '40-Matte Black': 3, '41-Matte Black': 5, '42-Matte Black': 6, '43-Matte Black': 4, '44-Matte Black': 2 },
  },
  'essential-premium-white-tee': {
    id: '5',
    name: 'Essential Premium White Tee',
    slug: 'essential-premium-white-tee',
    category: 'Clothing',
    sku: 'FRM-TS-001',
    description: '260 GSM Supima combed cotton t-shirt with ribbed collar and tailored boxy cut. Pre-shrunk finish preserves the premium fit through every wash.',
    images: ['/product-tshirt-1.jpg'],
    basePricePaisa: 249900,
    salePricePaisa: null,
    isNew: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Onyx Black', hex: '#171717' },
    ],
    stock: {
      'S-White': 40, 'M-White': 50, 'L-White': 45, 'XL-White': 20,
      'S-Onyx Black': 25, 'M-Onyx Black': 30, 'L-Onyx Black': 20, 'XL-Onyx Black': 15,
    },
  },
  'chunky-runner-sneaker': {
    id: '6',
    name: 'Chunky Runner Sneaker',
    slug: 'chunky-runner-sneaker',
    category: 'Sneakers',
    sku: 'FRM-RUN-001',
    description: 'Contemporary athletic silhouette featuring layered mesh and suede paneling, responsive foam midsole, and distinctive sculptural outsole design.',
    images: ['/product-sneaker-1.jpg'],
    basePricePaisa: 1299900,
    salePricePaisa: 999900,
    isNew: false,
    sizes: ['40', '41', '42', '43', '44'],
    colors: [{ name: 'Triple White', hex: '#FAFAFA' }],
    stock: { '40-Triple White': 4, '41-Triple White': 6, '42-Triple White': 5, '43-Triple White': 3, '44-Triple White': 2 },
  },
  'tailored-cargo-trousers': {
    id: '7',
    name: 'Tailored Cargo Trousers',
    slug: 'tailored-cargo-trousers',
    category: 'Clothing',
    sku: 'FRM-CRG-001',
    description: 'Modern relaxed fit cargo trousers crafted from durable stretch cotton twill. Features low-profile bellow pockets, elasticated hem toggles, and reinforced knees.',
    images: ['/product-clothing-1.jpg'],
    basePricePaisa: 649900,
    salePricePaisa: null,
    isNew: true,
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Olive Green', hex: '#4B5320' },
      { name: 'Midnight Black', hex: '#171717' },
    ],
    stock: {
      '30-Olive Green': 5, '32-Olive Green': 8, '34-Olive Green': 6, '36-Olive Green': 2,
      '30-Midnight Black': 6, '32-Midnight Black': 10, '34-Midnight Black': 8, '36-Midnight Black': 3,
    },
  },
  'heritage-low-top-sneaker': {
    id: '8',
    name: 'Heritage Low-Top Sneaker',
    slug: 'heritage-low-top-sneaker',
    category: 'Sneakers',
    sku: 'FRM-HRT-001',
    description: 'Classic tennis sneaker silhouette rendered in buttery soft Italian nappa leather with contrast heel tab and vintage ecru rubber sole.',
    images: ['/product-sneaker-2.jpg'],
    basePricePaisa: 799900,
    salePricePaisa: null,
    isNew: false,
    sizes: ['39', '40', '41', '42', '43'],
    colors: [{ name: 'Vintage White', hex: '#FDFBF7' }],
    stock: { '39-Vintage White': 3, '40-Vintage White': 5, '41-Vintage White': 7, '42-Vintage White': 4, '43-Vintage White': 2 },
  },
};

async function getProductBySlug(slug: string): Promise<DetailedProduct | null> {
  // 1. Try Supabase live database
  try {
    const supabase = await createClient();
    const { data: p } = await supabase
      .from('products')
      .select('*, categories(name, slug), product_variants(*), product_images(*)')
      .eq('slug', slug)
      .maybeSingle();

    if (p) {
      const categoryName = p.categories?.name || 'Clothing';
      const fallbackImage = categoryName.toLowerCase().includes('sneaker')
        ? '/product-sneaker-1.jpg'
        : '/product-clothing-1.jpg';

      const dbImages = (p.product_images || [])
        .sort((a: { sort_order?: number }, b: { sort_order?: number }) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((img: { url: string }) => img.url)
        .filter(Boolean);
      const images = dbImages.length > 0 ? dbImages : [fallbackImage];

      const variants = p.product_variants || [];
      const rawSizes = (variants as { size: string | null }[])
        .map((v) => v.size)
        .filter((s): s is string => Boolean(s));
      const sizes = Array.from(new Set(rawSizes));
      const colorMap = new Map<string, string>();
      const stock: Record<string, number> = {};

      for (const v of variants) {
        const cName = v.color || 'Default';
        colorMap.set(cName, v.color_hex || '#171717');
        const sName = v.size || 'Standard';
        const qty = v.stock_quantity ?? 20;
        stock[`${sName}-${cName}`] = qty;
        stock[sName] = Math.max(stock[sName] ?? 0, qty);
      }

      const colors = Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));
      const effectiveSizes = sizes.length ? sizes : ['S', 'M', 'L', 'XL'];
      const effectiveColors = colors.length ? colors : [{ name: 'Default', hex: '#171717' }];

      for (const s of effectiveSizes) {
        for (const c of effectiveColors) {
          const key = `${s}-${c.name}`;
          if (stock[key] === undefined) {
            stock[key] = 20;
          }
        }
        if (stock[s] === undefined) {
          stock[s] = 20;
        }
      }

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: categoryName,
        description: p.description || '',
        images,
        basePricePaisa: p.base_price_paisa,
        salePricePaisa: p.sale_price_paisa,
        isNew: p.is_featured ?? false,
        sku: p.sku || `FRM-${p.slug.slice(0, 3).toUpperCase()}-001`,
        sizes: effectiveSizes,
        colors: effectiveColors,
        stock,
      };
    }
  } catch (err) {
    console.error('Error fetching product from Supabase:', err);
  }

  // 2. Fallback to catalog seed
  return SEED_CATALOG[slug] ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found — FORME' };
  return {
    title: `${product.name} — FORME`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Related products
  const related = Object.values(SEED_CATALOG)
    .filter((p) => p.slug !== slug && p.category === product.category)
    .slice(0, 4)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      image: p.images[0] ?? null,
      basePricePaisa: p.basePricePaisa,
      salePricePaisa: p.salePricePaisa,
      isNew: p.isNew,
    }));

  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <div className="container-wide" style={{ padding: 'clamp(32px, 4vw, 64px) 24px' }}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="breadcrumb" style={{ marginBottom: 24 }}>
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href={`/collections/${product.category.toLowerCase()}`}>{product.category}</Link>
            <span>/</span>
            <span aria-current="page">{product.name}</span>
          </nav>

          {/* Product Detail Component */}
          <ProductDetail product={product} />
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section
            aria-labelledby="related-heading"
            style={{ background: '#F4F1EB', padding: 'clamp(48px, 6vw, 80px) 0' }}
          >
            <div className="container-wide">
              <h2
                id="related-heading"
                className="heading-md"
                style={{ marginBottom: 32, textAlign: 'center' }}
              >
                You May Also Like
              </h2>
              <div className="product-grid">
                {related.map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <ChatWidget />
    </>
  );
}
