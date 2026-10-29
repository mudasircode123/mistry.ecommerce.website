'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { BRAND } from '@/lib/config';
import { useCart } from '@/components/cart/CartProvider';
import { useWishlist } from '@/components/wishlist/WishlistProvider';
import CartSidebar from '@/components/cart/CartSidebar';

const NAV_LINKS = [
  { label: 'New Arrivals', href: '/collections/new-arrivals' },
  { label: 'Clothing', href: '/collections/clothing' },
  { label: 'Sneakers', href: '/collections/sneakers' },
  { label: 'Accessories', href: '/collections/accessories' },
];

export default function Header() {
  const { itemCount, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar" role="complementary" aria-label="Store announcement">
        <marquee
          behavior="scroll"
          direction="left"
          style={{ width: '100%', display: 'block' }}
        >
          Free Delivery on Orders Over Rs. 3,000 · Cash on Delivery Available Nationwide
        </marquee>
      </div>

      {/* Header */}
      <header className={`site-header${scrolled ? ' scrolled' : ''}`} role="banner">
        <div className="container-wide site-header-inner">
          {/* Mobile: hamburger */}
          <button
            id="mobile-menu-toggle"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen(true)}
            className="site-hamburger"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link href="/" aria-label={`${BRAND.name} — home`} className="flex-shrink-0">
            <span style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 900,
              fontSize: 22,
              letterSpacing: '0.18em',
              color: '#171717',
              textDecoration: 'none',
            }}>
              {BRAND.name}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Main navigation" className="site-desktop-nav">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="site-header-actions">
            {/* Search */}
            <button
              id="search-trigger"
              aria-label="Open search"
              onClick={() => setSearchOpen(true)}
              className="site-icon-btn"
            >
              <Search size={20} />
            </button>

            {/* Account */}
            <Link
              href="/account"
              aria-label="My account"
              className="site-icon-btn site-icon-btn-desktop-only"
            >
              <User size={20} />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label={`My wishlist (${wishlistCount} items)`}
              className="site-icon-btn site-icon-btn-desktop-only"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: '#171717',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              id="cart-toggle"
              aria-label={`Shopping cart (${itemCount} items)`}
              onClick={openCart}
              className="site-icon-btn"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: '#171717',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <>
          <div
            className="overlay-backdrop"
            onClick={() => setSearchOpen(false)}
            aria-hidden="true"
          />
          <div
            role="search"
            aria-label="Site search"
            className="search-overlay"
          >
            <form onSubmit={handleSearch} className="container-wide">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Search size={20} style={{ color: '#6B665F', flexShrink: 0 }} />
                <input
                  ref={searchRef}
                  id="search-input"
                  type="search"
                  placeholder="Search for clothing, sneakers, accessories…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: 18,
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                    background: 'transparent',
                    color: '#171717',
                  }}
                />
                <button
                  type="button"
                  aria-label="Close search"
                  onClick={() => setSearchOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, color: '#171717' }}
                >
                  <X size={20} />
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`mobile-menu${mobileOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #E8E4DD' }}>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '0.18em' }}>
            {BRAND.name}
          </span>
          <button
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#171717' }}
          >
            <X size={22} />
          </button>
        </div>

        <nav aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                padding: '18px 24px',
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '1px solid #E8E4DD',
                color: '#171717',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '24px' }}>
          <Link
            href="/account"
            onClick={() => setMobileOpen(false)}
            className="btn btn-outline w-full"
            style={{ marginBottom: 12 }}
          >
            <User size={16} /> My Account
          </Link>
          <Link
            href="/wishlist"
            onClick={() => setMobileOpen(false)}
            className="btn btn-ghost w-full"
          >
            <Heart size={16} /> My Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ''}
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="overlay-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
          style={{ zIndex: 140 }}
        />
      )}

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
}
