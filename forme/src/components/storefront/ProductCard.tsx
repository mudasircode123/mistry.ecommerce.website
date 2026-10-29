'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { formatPrice } from '@/lib/config';
import { useToast } from '@/components/ui/ToastProvider';
import { useCart } from '@/components/cart/CartProvider';
import { useWishlist } from '@/components/wishlist/WishlistProvider';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  category?: string;
  image?: string | null;
  basePricePaisa: number;
  salePricePaisa?: number | null;
  isNew?: boolean;
  isFeatured?: boolean;
}

export default function ProductCard({
  id,
  name,
  slug,
  category,
  image,
  basePricePaisa,
  salePricePaisa,
  isNew,
}: ProductCardProps) {
  const { toast } = useToast();
  const { addItem, openCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(id);
  const hasDiscount = Boolean(salePricePaisa && salePricePaisa < basePricePaisa);
  const displayPrice = salePricePaisa && hasDiscount ? salePricePaisa : basePricePaisa;
  const discountPct = hasDiscount
    ? Math.round((1 - salePricePaisa! / basePricePaisa) * 100)
    : 0;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `${id}-default`,
      productId: id,
      variantId: null,
      name,
      category: category ?? '',
      image: image ?? null,
      size: null,
      color: null,
      unitPricePaisa: displayPrice,
      quantity: 1,
    });
    toast(`${name} added to cart`);
    openCart();
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id,
      name,
      slug,
      price: displayPrice,
      basePrice: basePricePaisa,
      salePrice: salePricePaisa,
      image,
      category,
    });
  }

  const [imgSrc, setImgSrc] = React.useState<string>(image || '/product-clothing-1.jpg');

  return (
    <Link
      href={`/products/${slug}`}
      className="product-card"
      aria-label={`${name} — ${formatPrice(displayPrice)}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="product-card__image-wrap">
        {/* Badges */}
        {hasDiscount && (
          <span className="product-badge product-badge-sale">
            −{discountPct}%
          </span>
        )}
        {isNew && !hasDiscount && (
          <span className="product-badge product-badge-new">New</span>
        )}

        {/* Wishlist */}
        <button
          className={`product-card__wishlist${wishlisted ? ' active' : ''}`}
          aria-label={wishlisted ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          onClick={handleWishlist}
          style={wishlisted ? { color: '#e11d48' } : undefined}
        >
          <Heart size={16} fill={wishlisted ? '#e11d48' : 'none'} color={wishlisted ? '#e11d48' : '#171717'} />
        </button>

        {/* Image */}
        <Image
          src={imgSrc}
          alt={name}
          fill
          className="product-card__image"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          unoptimized={imgSrc.startsWith('http')}
          onError={() => {
            if (imgSrc !== '/product-clothing-1.jpg') {
              setImgSrc('/product-clothing-1.jpg');
            }
          }}
        />

        {/* Quick Add (appears on hover) */}
        <button
          aria-label={`Quick add ${name} to cart`}
          onClick={handleQuickAdd}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(23,23,23,0.88)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            padding: '12px',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            transform: 'translateY(100%)',
            transition: 'transform 0.25s ease',
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          }}
          className="product-card__quick-add"
        >
          Quick Add
        </button>

        <style>{`
          .product-card:hover .product-card__quick-add {
            transform: translateY(0);
          }
        `}</style>
      </div>

      <div className="product-card__body">
        {category && (
          <span className="product-card__category">{category}</span>
        )}
        <h3 className="product-card__name">{name}</h3>
        <div className="product-card__price" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginTop: 'auto', paddingTop: 6 }}>
          <div>
            <span className={hasDiscount ? 'product-card__price-sale' : ''}>
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="product-card__price-original">
                {formatPrice(basePricePaisa)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`Add ${name} to cart`}
            style={{
              background: '#171717',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            + Add
          </button>
        </div>
      </div>
    </Link>
  );
}
