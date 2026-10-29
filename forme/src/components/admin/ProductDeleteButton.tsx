'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface Props {
  productId: string;
  productName: string;
}

export default function ProductDeleteButton({ productId, productName }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Are you sure you want to deactivate "${productName}"? It will no longer appear in the storefront.`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}?soft=true`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }

      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      aria-label={`Deactivate ${productName}`}
      title="Deactivate Product"
      style={{
        background: 'none',
        border: 'none',
        color: '#EF4444',
        cursor: 'pointer',
        padding: '6px',
        borderRadius: 4,
        display: 'inline-flex',
        alignItems: 'center',
        opacity: loading ? 0.5 : 1,
      }}
    >
      <Trash2 size={16} />
    </button>
  );
}
