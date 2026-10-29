'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { formatPrice } from '@/lib/config';

export default function CartSidebar() {
  const { cart, isOpen, closeCart, removeItem, updateQty, subtotalPaisa, itemCount } = useCart();
  const deliveryFeePaisa = subtotalPaisa >= 300000 ? 0 : 25000; // Free over Rs. 3000
  const discountPaisa = cart.couponDiscount ?? 0;
  const totalPaisa = Math.max(0, subtotalPaisa - discountPaisa + deliveryFeePaisa);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="overlay-backdrop"
          onClick={closeCart}
          aria-hidden="true"
          style={{ zIndex: 190 }}
        />
      )}

      {/* Sidebar */}
      <div
        id="cart-sidebar"
        className={`cart-sidebar${isOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-live="polite"
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid #D8D4CD',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingBag size={18} />
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Your Cart {itemCount > 0 && `(${itemCount})`}
            </span>
          </div>
          <button
            aria-label="Close cart"
            onClick={closeCart}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        {cart.items.length === 0 ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
            gap: 16,
          }}>
            <ShoppingBag size={48} style={{ color: '#D8D4CD' }} />
            <p style={{ fontSize: 14, color: '#6B665F', textAlign: 'center' }}>
              Your cart is empty.<br />Add some items to get started.
            </p>
            <Link
              href="/collections/new-arrivals"
              className="btn btn-primary btn-sm"
              onClick={closeCart}
              style={{ textDecoration: 'none' }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: 12,
                    paddingBottom: 16,
                    marginBottom: 16,
                    borderBottom: '1px solid #E8E4DD',
                  }}
                >
                  {/* Image */}
                  <div style={{
                    width: 80,
                    height: 96,
                    background: '#E8E4DD',
                    flexShrink: 0,
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="80px"
                        unoptimized={item.image.startsWith('http')}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#D8D4CD',
                      }}>
                        <ShoppingBag size={24} />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, lineHeight: 1.3 }}>
                      {item.name}
                    </p>
                    {(item.size || item.color) && (
                      <p style={{ fontSize: 11, color: '#6B665F', marginBottom: 6, letterSpacing: '0.04em' }}>
                        {[item.size, item.color].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#171717' }}>
                      {formatPrice(item.unitPricePaisa)}
                    </p>

                    {/* Qty */}
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 8, gap: 8 }}>
                      <div className="qty-control">
                        <button
                          className="qty-btn"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            item.quantity === 1
                              ? removeItem(item.id)
                              : updateQty(item.id, item.quantity - 1)
                          }
                        >
                          {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          aria-label="Increase quantity"
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#6B665F',
                          padding: 4,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div style={{ fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                    {formatPrice(item.unitPricePaisa * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              borderTop: '1px solid #D8D4CD',
              padding: '20px 24px 24px',
              flexShrink: 0,
            }}>
              {/* Coupon */}
              {cart.couponCode && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  marginBottom: 8,
                  color: '#065f46',
                }}>
                  <span>Coupon: {cart.couponCode}</span>
                  <span>−{formatPrice(discountPaisa)}</span>
                </div>
              )}

              {/* Subtotal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6, color: '#6B665F' }}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotalPaisa)}</span>
              </div>

              {/* Delivery */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 16, color: '#6B665F' }}>
                <span>Delivery</span>
                <span>{deliveryFeePaisa === 0 ? 'Free' : formatPrice(deliveryFeePaisa)}</span>
              </div>

              {/* Total */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 20,
                borderTop: '1px solid #E8E4DD',
                paddingTop: 14,
              }}>
                <span>Total</span>
                <span>{formatPrice(totalPaisa)}</span>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn btn-primary"
                id="cart-checkout-btn"
                style={{
                  width: '100%',
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                Proceed to Checkout
              </Link>

              <p style={{ fontSize: 11, color: '#6B665F', textAlign: 'center', marginTop: 12 }}>
                Cash on Delivery available · Secure checkout
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
