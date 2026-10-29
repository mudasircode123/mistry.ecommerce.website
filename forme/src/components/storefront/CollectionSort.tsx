'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CollectionSort({ defaultValue = 'newest' }: { defaultValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`?${params.toString()}`);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <label htmlFor="sort-select" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B665F' }}>
        Sort:
      </label>
      <select
        id="sort-select"
        name="sort"
        defaultValue={defaultValue}
        onChange={handleChange}
        style={{
          border: '1.5px solid #D8D4CD',
          padding: '8px 12px',
          fontSize: 13,
          fontFamily: 'inherit',
          background: '#fff',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <option value="newest">Newest First</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}
