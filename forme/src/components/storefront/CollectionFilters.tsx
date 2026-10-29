'use client';

import React, { useState } from 'react';

export default function CollectionFilters() {
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  function toggleSize(size: string) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  return (
    <>
      {/* Mobile filter toggle */}
      <button
        className="lg:hidden btn btn-outline btn-sm"
        onClick={() => setShowFilters(!showFilters)}
        aria-expanded={showFilters}
        style={{ marginBottom: 16 }}
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      <aside
        aria-label="Product filters"
        style={{
          width: 220,
          flexShrink: 0,
          display: showFilters ? 'block' : undefined,
        }}
        className="hidden lg:block"
      >
        <div style={{ marginBottom: 32 }}>
          <h3 style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 16,
            color: '#171717',
          }}>
            Size
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                aria-pressed={selectedSizes.includes(size)}
                className={`size-option${selectedSizes.includes(size) ? ' selected' : ''}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h3 style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 16,
            color: '#171717',
          }}>
            Price Range
          </h3>
          <p style={{ fontSize: 13, color: '#6B665F', marginBottom: 12 }}>
            Rs. {(priceRange[0] / 100).toLocaleString('en-PK')} — Rs. {(priceRange[1] / 100).toLocaleString('en-PK')}
          </p>
          <input
            type="range"
            min={0}
            max={200000}
            step={1000}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            aria-label="Maximum price filter"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <h3 style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 16,
            color: '#171717',
          }}>
            Category
          </h3>
          {['Clothing', 'Sneakers', 'Accessories'].map((cat) => (
            <label
              key={cat}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 10,
                cursor: 'pointer',
                fontSize: 13,
                color: '#6B665F',
              }}
            >
              <input
                type="checkbox"
                style={{ accentColor: '#171717' }}
                aria-label={`Filter by ${cat}`}
              />
              {cat}
            </label>
          ))}
        </div>
      </aside>
    </>
  );
}
