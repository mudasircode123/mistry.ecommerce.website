'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/config';
import { useWishlist } from '@/components/wishlist/WishlistProvider';
import { useCart } from '@/components/cart/CartProvider';
import { useToast } from '@/components/ui/ToastProvider';

export default function WishlistPage() {
  const { items, count, removeItem } = useWishlist();
  const { addItem, openCart } = useCart();
  const { toast } = useToast();

  function handleMoveToCart(item: (typeof items)[0]) {
    addItem({
      id: `${item.id}-default`,
      productId: item.id,
      variantId: null,
      name: item.name,
      category: item.category ?? null,
      image: item.image ?? null,
      size: null,
      color: null,
      unitPricePaisa: item.price,
      quantity: 1,
    });
    toast(`${item.name} added to cart`);
    openCart();
  }

  return (
    <>
      <Header />
      <main id="main-content" style={{ background: '#F4F1EB', minHeight: '60vh', paddingTop: 'calc(var(--announcement-height) + var(--header-height))' }}>
        <div style={{ background: '#171717', color: '#fff', padding: 'clamp(32px, 5vw, 56px) 0' }}>
          <div className="container-wide">
            <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700 }}>My Wishlist</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 6 }}>
              {count} saved {count === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        <div className="container-wide" style={{ padding: 'clamp(40px, 5vw, 64px) 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#6B665F' }}>
              <Heart size={48} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
              <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, color: '#171717' }}>Your wishlist is empty</p>
              <p style={{ fontSize: 14, marginBottom: 28 }}>Browse our collection and save items you love by clicking the heart icon.</p>
              <Link href="/collections/new-arrivals" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                Shop New Arrivals
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
              {items.map((item) => (
                <div key={item.id} style={{ background: '#fff', border: '1px solid #D8D4CD', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#E8E4DD' }}>
                    <Link href={`/products/${item.slug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Heart size={32} style={{ opacity: 0.2 }} />
                        </div>
                      )}
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from wishlist`}
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#6B665F',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      }}
                      title="Remove from wishlist"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <Link href={`/products/${item.slug}`} style={{ fontWeight: 600, fontSize: 14, color: '#171717', textDecoration: 'none', display: 'block', marginBottom: 6 }}>
                        {item.name}
                      </Link>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <span style={{ fontWeight: 700, color: '#171717' }}>{formatPrice(item.price)}</span>
                        {item.basePrice && item.salePrice && item.salePrice < item.basePrice && (
                          <span style={{ fontSize: 12, color: '#6B665F', textDecoration: 'line-through' }}>{formatPrice(item.basePrice)}</span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="btn btn-primary"
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, padding: '10px 12px' }}
                      >
                        <ShoppingBag size={14} /> Add to Cart
                      </button>
                      <Link
                        href={`/products/${item.slug}`}
                        className="btn btn-outline"
                        style={{ fontSize: 12, padding: '10px 12px', textDecoration: 'none' }}
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
