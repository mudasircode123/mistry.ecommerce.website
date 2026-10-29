'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Copy, Check } from 'lucide-react';
import { WELCOME_COUPON } from '@/lib/config';

const STORAGE_KEY = 'forme_popup_dismissed';

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState('/popup-fashion.jpg');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Don't show on admin/checkout/account pages
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (
        path.startsWith('/admin') ||
        path.startsWith('/checkout') ||
        path.startsWith('/auth')
      ) return;

      const dismissed = sessionStorage.getItem(STORAGE_KEY);
      if (!dismissed) {
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, '1');
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(WELCOME_COUPON.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement('textarea');
      el.value = WELCOME_COUPON.code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (!visible) return null;

  return (
    <div
      className="popup-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome 20% discount offer"
      onClick={(e) => e.target === e.currentTarget && dismiss()}
    >
      <div className="popup-modal">
        {/* Fashion Image */}
        <div className="popup-modal__image" style={{ position: 'relative', minHeight: 420, background: '#F4F1EB' }}>
          <Image
            src={imgSrc}
            alt="Premium fashion — FORME 20% OFF welcome offer"
            fill
            sizes="(max-width: 640px) 0vw, 430px"
            style={{ objectFit: 'cover', objectPosition: 'top center' }}
            priority
            onError={() => {
              if (imgSrc !== '/category-clothing.jpg') {
                setImgSrc('/category-clothing.jpg');
              }
            }}
          />
        </div>

        {/* Content */}
        <div className="popup-modal__content">
          {/* Close button */}
          <button
            className="popup-close"
            aria-label="Close offer popup"
            onClick={dismiss}
          >
            <X size={20} />
          </button>

          <div style={{ marginBottom: 8 }}>
            <span style={{
              display: 'inline-block',
              background: '#171717',
              color: '#FFFFFF',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '4px 10px',
            }}>
              20% OFF
            </span>
          </div>

          <h2 style={{
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: 'clamp(1.6rem, 3.2vw, 2.1rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: '#171717',
            marginBottom: 10,
            letterSpacing: '-0.02em',
          }}>
            Welcome to FORME<br />Get 20% Off
          </h2>

          <p style={{ fontSize: 14, color: '#6B665F', lineHeight: 1.6, marginBottom: 16 }}>
            Enjoy <strong style={{ color: '#171717' }}>20% off</strong> your first order of luxury Pakistani fashion, modern streetwear, and designer footwear.
          </p>

          {/* Coupon Code */}
          <div className="coupon-code">
            <span className="coupon-code__text" id="coupon-code-text">
              {WELCOME_COUPON.code}
            </span>
            <button
              onClick={copyCode}
              aria-label="Copy discount code"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: copied ? '#065f46' : '#171717',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.15s',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              {copied ? (
                <><Check size={14} /> Copied!</>
              ) : (
                <><Copy size={14} /> Copy Code</>
              )}
            </button>
          </div>

          {/* CTA */}
          <Link
            href="/collections/new-arrivals"
            onClick={dismiss}
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: 12, textDecoration: 'none' }}
            id="popup-shop-now"
          >
            Shop Now
          </Link>

          <button
            onClick={dismiss}
            className="btn-ghost"
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: 12,
              color: '#6B665F',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              padding: '8px 0',
            }}
          >
            No Thanks, Continue Shopping
          </button>

          <p style={{ fontSize: 11, color: '#6B665F', marginTop: 12, lineHeight: 1.4 }}>
            * Discount applied at checkout. Valid for new customers only.
            Cannot be combined with other offers.
          </p>
        </div>
      </div>
    </div>
  );
}
