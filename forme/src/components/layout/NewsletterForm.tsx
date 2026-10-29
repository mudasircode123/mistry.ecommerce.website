'use client';

import React, { useState } from 'react';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer_newsletter' }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      setStatus('success');
      setMessage(data.message || 'Thank you for subscribing!');
      setEmail('');
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Subscription error');
    }
  }

  return (
    <div className="footer-newsletter">
      <h4 className="footer-newsletter-heading">
        Stay Updated
      </h4>
      <p className="footer-newsletter-text">
        Subscribe to receive early drop access and exclusive offers.
      </p>

      {status === 'success' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--admin-success, #16a34a)', fontWeight: 500 }}>
          <Check size={14} />
          <span>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="footer-newsletter-form">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="footer-newsletter-input"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              aria-label="Subscribe to newsletter"
              className="footer-newsletter-btn"
            >
              <ArrowRight size={14} />
            </button>
          </div>
          {status === 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#dc2626' }}>
              <AlertCircle size={12} />
              <span>{message}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
