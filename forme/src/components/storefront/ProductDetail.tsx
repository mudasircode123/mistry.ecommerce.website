'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, ShoppingBag, Truck, RefreshCw, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { formatPrice } from '@/lib/config';
import { useCart } from '@/components/cart/CartProvider';
import { useWishlist } from '@/components/wishlist/WishlistProvider';
import { useToast } from '@/components/ui/ToastProvider';

interface ProductDetailProps {
  product: {
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
  };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const defaultSize = product.sizes?.[0] || 'Standard';
  const defaultColor = product.colors?.[0]?.name || 'Default';
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);
  const [selectedColor, setSelectedColor] = useState<string>(defaultColor);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [descExpanded, setDescExpanded] = useState(true);
  const [shippingExpanded, setShippingExpanded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const { addItem, openCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const wishlisted = isWishlisted(product.id);

  const hasDiscount = Boolean(product.salePricePaisa && product.salePricePaisa < product.basePricePaisa);
  const displayPrice = hasDiscount ? product.salePricePaisa! : product.basePricePaisa;
  const discountPct = hasDiscount
    ? Math.round((1 - product.salePricePaisa! / product.basePricePaisa) * 100)
    : 0;

  function getStock(size: string, color: string): number {
    if (!product.stock || Object.keys(product.stock).length === 0) return 20;
    if (product.stock[`${size}-${color}`] !== undefined) {
      return product.stock[`${size}-${color}`];
    }
    if (product.stock[size] !== undefined) {
      return product.stock[size];
    }
    for (const [key, val] of Object.entries(product.stock)) {
      if (key.toLowerCase().startsWith(`${size.toLowerCase()}-`)) {
        return val;
      }
    }
    return 20;
  }

  function handleAddToCart() {
    const sizeToUse = selectedSize || product.sizes?.[0] || 'Standard';
    const colorToUse = selectedColor || product.colors?.[0]?.name || 'Default';

    addItem({
      id: `${product.id}-${sizeToUse}-${colorToUse}`,
      productId: product.id,
      variantId: `${sizeToUse}-${colorToUse}`,
      name: product.name,
      category: product.category,
      image: product.images[0] ?? null,
      size: sizeToUse === 'Standard' ? null : sizeToUse,
      color: colorToUse === 'Default' ? null : colorToUse,
      unitPricePaisa: displayPrice,
      quantity,
    });

    toast(`${product.name} added to cart`);
    openCart();
  }

  function handleWishlist() {
    toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: displayPrice,
      basePrice: product.basePricePaisa,
      salePrice: product.salePricePaisa,
      image: product.images[0] ?? null,
      category: product.category,
    });
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 48,
      alignItems: 'start',
    }}>
      {/* Image Gallery */}
      <div>
        {/* Main Image */}
        <div style={{
          position: 'relative',
          aspectRatio: '3/4',
          background: '#E8E4DD',
          marginBottom: 12,
          overflow: 'hidden',
        }}>
          {product.images[activeImage] ? (
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              unoptimized={product.images[activeImage]?.startsWith('http')}
            />
          ) : null}

          {hasDiscount && (
            <span className="product-badge product-badge-sale">−{discountPct}%</span>
          )}
          {product.isNew && !hasDiscount && (
            <span className="product-badge product-badge-new">New</span>
          )}
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div style={{ display: 'flex', gap: 8 }}>
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
                aria-pressed={activeImage === i}
                style={{
                  width: 72,
                  height: 88,
                  position: 'relative',
                  border: activeImage === i ? '2px solid #171717' : '1.5px solid #D8D4CD',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'none',
                  padding: 0,
                  transition: 'border-color 0.15s',
                }}
              >
                <Image
                  src={img}
                  alt={`${product.name} view ${i + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="72px"
                  unoptimized={img?.startsWith('http')}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <span className="label-caps" style={{ color: '#6B665F', display: 'block', marginBottom: 8 }}>
          {product.category}
        </span>

        <h1 className="heading-lg" style={{ marginBottom: 12, letterSpacing: '-0.01em' }}>
          {product.name}
        </h1>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
          <span style={{
            fontSize: 22,
            fontWeight: 700,
            color: hasDiscount ? '#b91c1c' : '#171717',
          }}>
            {formatPrice(displayPrice)}
          </span>
          {hasDiscount && (
            <span style={{ fontSize: 16, color: '#6B665F', textDecoration: 'line-through' }}>
              {formatPrice(product.basePricePaisa)}
            </span>
          )}
        </div>

        <div className="divider" />

        {/* Color selector */}
        {product.colors.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
              Color: <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{selectedColor}</span>
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={`Select color: ${color.name}`}
                  aria-pressed={selectedColor === color.name}
                  title={color.name}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: color.hex,
                    border: selectedColor === color.name
                      ? '3px solid #171717'
                      : '2px solid #D8D4CD',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s',
                    boxShadow: '0 0 0 2px #fff',
                    outline: color.hex === '#FFFFFF' ? '1px solid #D8D4CD' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size selector */}
        <div style={{ marginBottom: 20 }} id="size-selector" tabIndex={-1}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <p style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: sizeError ? '#b91c1c' : '#171717',
            }}>
              Size {!selectedSize && sizeError && <span>(Please select a size)</span>}
            </p>
            <a
              href="/size-guide"
              style={{ fontSize: 12, color: '#6B665F', textDecoration: 'underline' }}
            >
              Size Guide
            </a>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {product.sizes.map((size) => {
              const stock = getStock(size, selectedColor);
              const unavailable = stock === 0;
              return (
                <button
                  key={size}
                  onClick={() => {
                    if (!unavailable) {
                      setSelectedSize(size);
                      setSizeError(false);
                    }
                  }}
                  aria-label={`Size ${size}${unavailable ? ' — out of stock' : ''}`}
                  disabled={unavailable}
                  className={`size-option${selectedSize === size ? ' selected' : ''}${unavailable ? ' unavailable' : ''}`}
                >
                  {size}
                </button>
              );
            })}
          </div>
          {selectedSize && getStock(selectedSize, selectedColor) <= 5 && getStock(selectedSize, selectedColor) > 0 && (
            <p style={{ fontSize: 12, color: '#b91c1c', marginTop: 8 }}>
              Only {getStock(selectedSize, selectedColor)} left in stock
            </p>
          )}
        </div>

        {/* Quantity */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
            Quantity
          </p>
          <div className="qty-control" style={{ display: 'inline-flex' }}>
            <button
              className="qty-btn"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >−</button>
            <span className="qty-display" aria-label={`Quantity: ${quantity}`}>{quantity}</span>
            <button
              className="qty-btn"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
            >+</button>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <button
            onClick={handleAddToCart}
            className="btn btn-primary"
            id="add-to-cart-btn"
            style={{ flex: 1, display: 'flex', gap: 8 }}
          >
            <ShoppingBag size={16} />
            Add to Cart
          </button>
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="btn btn-outline"
            style={{
              width: 52,
              padding: 0,
              borderColor: wishlisted ? '#e11d48' : undefined,
              color: wishlisted ? '#e11d48' : undefined,
            }}
          >
            <Heart size={18} fill={wishlisted ? '#e11d48' : 'none'} color={wishlisted ? '#e11d48' : '#171717'} />
          </button>
        </div>

        {/* Trust Signals */}
        <div style={{
          background: '#F4F1EB',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          marginBottom: 24,
        }}>
          {[
            { icon: Truck, text: 'Free delivery on orders over Rs. 3,000' },
            { icon: RefreshCw, text: '7-day returns on unworn items with tags' },
            { icon: Shield, text: 'Cash on Delivery available nationwide' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#6B665F' }}>
              <Icon size={14} style={{ flexShrink: 0 }} />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* SKU */}
        <p style={{ fontSize: 12, color: '#6B665F', marginBottom: 24 }}>
          SKU: {product.sku}
        </p>

        {/* Accordion: Description */}
        <div style={{ borderTop: '1px solid #D8D4CD' }}>
          <button
            onClick={() => setDescExpanded(!descExpanded)}
            aria-expanded={descExpanded}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Description
            {descExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {descExpanded && (
            <p style={{
              fontSize: 14,
              color: '#6B665F',
              lineHeight: 1.7,
              paddingBottom: 16,
              borderBottom: '1px solid #D8D4CD',
            }}>
              {product.description}
            </p>
          )}
        </div>

        {/* Accordion: Shipping */}
        <div>
          <button
            onClick={() => setShippingExpanded(!shippingExpanded)}
            aria-expanded={shippingExpanded}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Delivery & Returns
            {shippingExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {shippingExpanded && (
            <div style={{
              fontSize: 13,
              color: '#6B665F',
              lineHeight: 1.7,
              paddingBottom: 16,
              borderBottom: '1px solid #D8D4CD',
            }}>
              <p style={{ marginBottom: 8 }}>
                <strong style={{ color: '#171717' }}>Standard Delivery:</strong> 3–5 business days. Rs. 250 flat rate. Free on orders over Rs. 3,000.
              </p>
              <p style={{ marginBottom: 8 }}>
                <strong style={{ color: '#171717' }}>Cash on Delivery:</strong> Available at checkout. Pay when your parcel arrives.
              </p>
              <p>
                <strong style={{ color: '#171717' }}>Returns:</strong> 7-day return window. Items must be unworn, unwashed, with original tags. Contact us to initiate a return.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
