'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Truck,
  BarChart3,
  Settings,
  MessageSquare,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { BRAND } from '@/lib/config';

interface AdminShellProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  { href: '/admin/suppliers', label: 'Suppliers', icon: Truck },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);


  // Prevent background scrolling when mobile drawer is open & handle Escape key
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  function isItemActive(href: string) {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  }

  const currentNav = NAV_ITEMS.find((item) => isItemActive(item.href)) || NAV_ITEMS[0];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC', color: '#1F2937' }}>
      {/* Mobile Top Navigation Bar */}
      <header
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
        className="admin-mobile-header"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            style={{
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1F2937',
            }}
          >
            <Menu size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link
              href="/admin"
              style={{
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontWeight: 900,
                fontSize: 18,
                letterSpacing: '0.12em',
                color: '#1F2937',
                textDecoration: 'none',
              }}
            >
              {BRAND.name}
            </Link>
            <span
              style={{
                background: '#EDE9FE',
                color: '#7C3AED',
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 9999,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Admin
            </span>
          </div>
        </div>

        <Link
          href="/"
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#7C3AED',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          Store <ExternalLink size={13} />
        </Link>
      </header>

      {/* Mobile Drawer (Backdrop + Slide-in Menu) */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Admin Navigation Menu"
          style={{ position: 'fixed', inset: 0, zIndex: 60 }}
          className="admin-mobile-drawer"
        >
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(3px)',
              animation: 'fadeIn 0.2s ease',
            }}
          />

          {/* Drawer Content */}
          <div
            style={{
              position: 'relative',
              width: '85%',
              maxWidth: 300,
              background: '#FFFFFF',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              animation: 'slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              zIndex: 70,
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '20px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #E5E7EB',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '0.1em', color: '#1F2937' }}>
                  {BRAND.name}
                </span>
                <span
                  style={{
                    background: '#EDE9FE',
                    color: '#7C3AED',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 9999,
                  }}
                >
                  Admin
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                style={{
                  background: '#F3F4F6',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px',
                  cursor: 'pointer',
                  color: '#4B5563',
                  display: 'flex',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav list in drawer */}
            <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = isItemActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: active ? 600 : 500,
                      color: active ? '#7C3AED' : '#4B5563',
                      background: active ? '#EDE9FE' : 'transparent',
                      textDecoration: 'none',
                      transition: 'background-color 0.15s, color 0.15s',
                    }}
                  >
                    <Icon size={18} color={active ? '#7C3AED' : '#6B7280'} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer */}
            <div style={{ padding: '16px', borderTop: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link
                href="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  background: '#FFFFFF',
                  color: '#1F2937',
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <ExternalLink size={14} /> Back to Storefront
              </Link>
              <form action="/auth/signout" method="POST">
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#FEE2E2',
                    color: '#DC2626',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Shell: Sidebar + Content */}
      <div style={{ display: 'flex', flex: 1, minHeight: '100vh' }}>
        {/* Desktop Sidebar */}
        <aside
          style={{
            width: 260,
            background: '#FFFFFF',
            flexDirection: 'column',
            flexShrink: 0,
            borderRight: '1px solid #E5E7EB',
            position: 'sticky',
            top: 0,
            height: '100vh',
            zIndex: 30,
          }}
          className="admin-desktop-sidebar"
        >
          {/* Brand & SaaS badge */}
          <div style={{ padding: '24px 20px', borderBottom: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <Link
                href="/admin"
                style={{
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontWeight: 900,
                  fontSize: 20,
                  letterSpacing: '0.14em',
                  color: '#1F2937',
                  textDecoration: 'none',
                }}
              >
                {BRAND.name}
              </Link>
              <span
                style={{
                  background: '#EDE9FE',
                  color: '#7C3AED',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 9999,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                SaaS
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#6B7280', margin: 0, fontWeight: 500 }}>
              Commerce Management Suite
            </p>
          </div>

          {/* Navigation Links */}
          <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9CA3AF', padding: '4px 12px 8px' }}>
              Core Navigation
            </div>
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = isItemActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: active ? 600 : 500,
                    color: active ? '#7C3AED' : '#4B5563',
                    background: active ? '#EDE9FE' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                  onMouseOver={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                      e.currentTarget.style.color = '#1F2937';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#4B5563';
                    }
                  }}
                >
                  <Icon size={17} color={active ? '#7C3AED' : '#6B7280'} />
                  <span style={{ flex: 1 }}>{label}</span>
                  {active && (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#7C3AED',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div style={{ padding: '16px', borderTop: '1px solid #E5E7EB', background: '#FAFAFA' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#EDE9FE',
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                <ShieldCheck size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1F2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Store Administrator
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#16A34A', fontWeight: 500 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} />
                  Secure Session
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Link
                href="/"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '7px 10px',
                  borderRadius: 6,
                  border: '1px solid #E5E7EB',
                  background: '#FFFFFF',
                  color: '#4B5563',
                  fontSize: 12,
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                <ExternalLink size={12} /> Store
              </Link>
              <form action="/auth/signout" method="POST">
                <button
                  type="submit"
                  aria-label="Sign out"
                  title="Sign out"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '7px 10px',
                    borderRadius: 6,
                    border: '1px solid #FCA5A5',
                    background: '#FEF2F2',
                    color: '#DC2626',
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={13} />
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Desktop Top Header Bar */}
          <header
            style={{
              height: 60,
              background: '#FFFFFF',
              borderBottom: '1px solid #E5E7EB',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 32px',
              position: 'sticky',
              top: 0,
              zIndex: 20,
            }}
            className="admin-desktop-header"
          >
            {/* Breadcrumbs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B7280' }}>
              <Link href="/admin" style={{ color: '#6B7280', textDecoration: 'none' }}>Admin</Link>
              <ChevronRight size={14} color="#9CA3AF" />
              <span style={{ color: '#1F2937', fontWeight: 600 }}>{currentNav.label}</span>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#EDE9FE',
                  color: '#7C3AED',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '6px 12px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  transition: 'background-color 0.15s',
                }}
              >
                <span>Live Storefront</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </header>

          {/* Page Body */}
          <main style={{ flex: 1, padding: 'clamp(14px, 2.5vw, 32px)', width: '100%', maxWidth: 1400, margin: '0 auto', minWidth: 0, boxSizing: 'border-box' }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
