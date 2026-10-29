import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Package } from 'lucide-react';
import { BRAND, formatPrice } from '@/lib/config';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/admin';
import ProductDeleteButton from '@/components/admin/ProductDeleteButton';

export const metadata: Metadata = { title: `Products — Admin — ${BRAND.name}` };

interface AdminProductRow {
  id: string;
  name: string;
  slug: string;
  base_price_paisa: number;
  sale_price_paisa: number | null;
  is_active: boolean;
  is_featured: boolean;
  sourcing_type: string;
  categories: { name: string } | null;
  product_images?: { url: string; is_primary: boolean }[];
}

export default async function AdminProductsPage() {
  const { supabase } = await requireAdmin('/admin/products');

  let products: AdminProductRow[] | null = null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, slug, base_price_paisa, sale_price_paisa, is_active, is_featured, sourcing_type, categories(name), product_images(url, is_primary)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      products = data as unknown as AdminProductRow[];
    }
  } catch {
    // Supabase query error fallback
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          background: '#FFFFFF',
          padding: 'clamp(14px, 2vw, 24px)',
          borderRadius: 12,
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 700, color: '#1F2937', margin: 0 }}>
              Products Catalog
            </h1>
            <span
              style={{
                background: '#EDE9FE',
                color: '#7C3AED',
                fontSize: 12,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 9999,
              }}
            >
              {products?.length ?? 0} items
            </span>
          </div>
          <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>
            Manage inventory, variants, prices, and status across your Pakistan catalog.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#7C3AED',
            color: '#FFFFFF',
            padding: '10px 18px',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 600,
            boxShadow: '0 1px 2px rgba(124, 58, 237, 0.2)',
          }}
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Products Table Card */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        {!products || products.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center', color: '#6B7280' }}>
            <Package size={44} style={{ margin: '0 auto 16px', color: '#9CA3AF' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', marginBottom: 6 }}>No products found</h3>
            <p style={{ fontSize: 13, marginBottom: 20 }}>Your catalog is currently empty. Create your first product.</p>
            <Link
              href="/admin/products/new"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#7C3AED',
                color: '#FFFFFF',
                padding: '10px 20px',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <Plus size={16} /> Add First Product
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 680 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Product</th>
                  <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Category</th>
                  <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Price (PKR)</th>
                  <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Status</th>
                  <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => {
                  const primaryImg = p.product_images?.find((img) => img.is_primary)?.url || p.product_images?.[0]?.url || '/product-clothing-1.jpg';

                  return (
                    <tr
                      key={p.id}
                      className="admin-tr-hover"
                      style={{
                        borderBottom: idx === products!.length - 1 ? 'none' : '1px solid #F1F5F9',
                      }}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 44, height: 44, position: 'relative', borderRadius: 8, overflow: 'hidden', background: '#F1F5F9', flexShrink: 0, border: '1px solid #E5E7EB' }}>
                            <Image src={primaryImg} alt={p.name} fill sizes="44px" style={{ objectFit: 'cover' }} unoptimized />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#1F2937', fontSize: 14 }}>{p.name}</div>
                            <div style={{ fontSize: 12, color: '#9CA3AF' }}>/{p.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: '#F1F5F9', color: '#4B5563', padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
                          {p.categories?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ color: '#1F2937', fontWeight: 700, fontSize: 13 }}>
                          {formatPrice(p.base_price_paisa)}
                        </div>
                        {p.sale_price_paisa && (
                          <div style={{ color: '#16A34A', fontSize: 11, fontWeight: 600 }}>
                            Sale: {formatPrice(p.sale_price_paisa)}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '3px 10px',
                            borderRadius: 9999,
                            fontSize: 11,
                            fontWeight: 600,
                            background: p.is_active ? '#DCFCE7' : '#FEE2E2',
                            color: p.is_active ? '#16A34A' : '#DC2626',
                          }}
                        >
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.is_active ? '#16A34A' : '#DC2626' }} />
                          {p.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            style={{
                              color: '#6B7280',
                              padding: '6px 10px',
                              borderRadius: 6,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              textDecoration: 'none',
                              fontSize: 12,
                              fontWeight: 500,
                              background: '#F1F5F9',
                              border: '1px solid #E2E8F0',
                            }}
                            title="Edit Product"
                          >
                            <Edit size={14} color="#7C3AED" />
                            <span>Edit</span>
                          </Link>
                          <ProductDeleteButton productId={p.id} productName={p.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
