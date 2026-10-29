'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, AlertCircle } from 'lucide-react';

interface CategoryOption {
  id: string;
  name: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'a0000000-0000-0000-0000-000000000001', name: 'Clothing' },
  { id: 'a0000000-0000-0000-0000-000000000002', name: 'Sneakers' },
  { id: 'a0000000-0000-0000-0000-000000000003', name: 'Accessories' },
];

interface ProductFormProps {
  initialData?: {
    id?: string;
    name?: string;
    description?: string | null;
    categoryId?: string;
    basePricePaisa?: number;
    salePricePaisa?: number | null;
    sku?: string | null;
    imageUrl?: string;
    isActive?: boolean;
    isFeatured?: boolean;
  };
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || CATEGORIES[0].id);
  const [basePricePkr, setBasePricePkr] = useState(
    initialData?.basePricePaisa ? (initialData.basePricePaisa / 100).toString() : ''
  );
  const [salePricePkr, setSalePricePkr] = useState(
    initialData?.salePricePaisa ? (initialData.salePricePaisa / 100).toString() : ''
  );
  const [sku, setSku] = useState(initialData?.sku || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '/product-clothing-1.jpg');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const basePrice = parseFloat(basePricePkr);
    if (isNaN(basePrice) || basePrice <= 0) {
      setError('Please provide a valid base price in PKR.');
      return;
    }

    const salePrice = salePricePkr ? parseFloat(salePricePkr) : null;
    if (salePrice !== null && (isNaN(salePrice) || salePrice <= 0)) {
      setError('Please provide a valid sale price or leave empty.');
      return;
    }

    setLoading(true);

    const payload = {
      name,
      description,
      categoryId,
      basePricePaisa: Math.round(basePrice * 100),
      salePricePaisa: salePrice !== null ? Math.round(salePrice * 100) : null,
      sku,
      imageUrl,
      isActive,
      isFeatured,
    };

    try {
      const url = isEdit && initialData?.id
        ? `/api/admin/products/${initialData.id}`
        : '/api/admin/products';

      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    if (!confirm('Are you sure you want to permanently delete this product?')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${initialData.id}?soft=false`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top action bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          background: '#FFFFFF',
          padding: '18px 24px',
          borderRadius: 12,
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href="/admin/products"
            style={{
              color: '#6B7280',
              textDecoration: 'none',
              display: 'flex',
              padding: '6px',
              borderRadius: 6,
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
            }}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 700, color: '#1F2937', margin: 0 }}>
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6B7280' }}>
              {isEdit ? `Editing ${initialData?.name || 'catalog item'}` : 'Configure pricing, category, and catalog visibility'}
            </p>
          </div>
        </div>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FECACA',
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Trash2 size={14} /> Delete Product
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 8,
            padding: '12px 16px',
            color: '#DC2626',
            fontSize: 13,
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* General Info Card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            padding: 'clamp(16px, 2.5vw, 24px)',
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: 0 }}>
            General Information
          </h2>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Heavyweight Fleece Zip Hoodie"
              style={{
                width: '100%',
                background: '#FFFFFF',
                border: '1.5px solid #E5E7EB',
                color: '#1F2937',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1.5px solid #E5E7EB',
                  color: '#1F2937',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                SKU (Stock Keeping Unit)
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. FRM-HOD-002"
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1.5px solid #E5E7EB',
                  color: '#1F2937',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
              Primary Image URL / Path
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/product-clothing-1.jpg or https://..."
              style={{
                width: '100%',
                background: '#FFFFFF',
                border: '1.5px solid #E5E7EB',
                color: '#1F2937',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none',
              }}
            />
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '4px 0 0' }}>
              Reference local images (/product-clothing-1.jpg, /product-sneaker-1.jpg, /product-jacket-1.jpg) or Supabase Storage URLs.
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fabric details, silhouette, tailoring specs, and care recommendations..."
              style={{
                width: '100%',
                background: '#FFFFFF',
                border: '1.5px solid #E5E7EB',
                color: '#1F2937',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* Pricing & Flags Card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            padding: 'clamp(16px, 2.5vw, 24px)',
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: 0 }}>
            Pricing & Visibility
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                Base Price (PKR) *
              </label>
              <input
                type="number"
                required
                value={basePricePkr}
                onChange={(e) => setBasePricePkr(e.target.value)}
                placeholder="5499"
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1.5px solid #E5E7EB',
                  color: '#1F2937',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                Sale Price (PKR, Optional)
              </label>
              <input
                type="number"
                value={salePricePkr}
                onChange={(e) => setSalePricePkr(e.target.value)}
                placeholder="Leave blank if not on sale"
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1.5px solid #E5E7EB',
                  color: '#1F2937',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, paddingTop: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#1F2937', fontSize: 14, fontWeight: 500 }}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={{ accentColor: '#7C3AED', width: 16, height: 16 }}
              />
              Active on Storefront
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#1F2937', fontSize: 14, fontWeight: 500 }}>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                style={{ accentColor: '#7C3AED', width: 16, height: 16 }}
              />
              Featured Product
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 4 }}>
          <Link
            href="/admin/products"
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              color: '#4B5563',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#7C3AED',
              color: '#FFFFFF',
              padding: '10px 24px',
              borderRadius: 8,
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 1px 2px rgba(124, 58, 237, 0.2)',
            }}
          >
            <Save size={16} />
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
