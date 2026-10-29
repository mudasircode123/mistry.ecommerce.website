import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { BRAND } from '@/lib/config';
import NewsletterForm from './NewsletterForm';

const FOOTER_LINKS = {
  Company: [
    { label: 'About FORME', href: '/about' },
    { label: 'Careers', href: '/contact?topic=careers' },
    { label: 'Admin Dashboard', href: '/admin' },
    { label: 'Contact Us', href: '/contact' },
  ],
  'Customer Care': [
    { label: 'Track My Order', href: '/orders/track' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Shipping & Rates', href: '/shipping' },
    { label: 'FAQ', href: '/faq' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Shipping Policy', href: '/shipping' },
    { label: 'Return Policy', href: '/returns' },
  ],
};

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="site-footer" role="contentinfo">
      {/* Main Footer */}
      <div className="container-wide footer-main">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div className="footer-brand-title">
              {BRAND.name}
            </div>
            <p className="footer-brand-desc">
              Premium fashion and streetwear, curated for Pakistan&apos;s style-forward generation.
            </p>

            {/* Social Links */}
            <div className="footer-social-wrap">
              <a
                href={`https://instagram.com/${BRAND.instagramHandle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow FORME on Instagram"
                className="footer-social-link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href={`https://facebook.com/${BRAND.facebookHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow FORME on Facebook"
                className="footer-social-link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="footer-heading">{section}</h3>
              <nav aria-label={`${section} links`} className="footer-nav">
                {links.map((link) => (
                  <Link
                    key={`${section}-${link.label}`}
                    href={link.href}
                    className="footer-link"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="footer-heading">Get in Touch</h3>
            <div className="footer-contact-list">
              <a
                href={`mailto:${BRAND.contactEmail}`}
                className="footer-contact-item"
              >
                <Mail size={14} className="footer-contact-icon" />
                <span>{BRAND.contactEmail}</span>
              </a>
              <a
                href={`tel:${BRAND.contactPhone.replace(/\s/g, '')}`}
                className="footer-contact-item"
              >
                <Phone size={14} className="footer-contact-icon" />
                <span>{BRAND.contactPhone}</span>
              </a>
              <span className="footer-contact-item">
                <MapPin size={14} className="footer-contact-icon" />
                <span>Lahore, Pakistan</span>
              </span>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container-wide footer-bottom-inner">
          <p className="footer-bottom-text">
            © {currentYear} {BRAND.name}. All rights reserved. Serving Pakistan nationwide.
          </p>
          <p className="footer-bottom-text">
            Prices in PKR · Cash on Delivery · Secure Checkout
          </p>
        </div>
      </div>
    </footer>
  );
}
