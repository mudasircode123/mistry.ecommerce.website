'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { BRAND } from '@/lib/config';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/account/reset-password`,
    });
    setLoading(false);
    if (err) setError(err.message);
    else setSent(true);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F4F1EB', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #D8D4CD', padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Link href="/" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 900, fontSize: 22, letterSpacing: '0.18em', color: '#171717', textDecoration: 'none' }}>
            {BRAND.name}
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <div style={{ background: '#fff', border: '1px solid #D8D4CD', padding: 'clamp(32px, 5vw, 48px)' }}>
            {sent ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <CheckCircle size={28} style={{ color: '#16a34a' }} />
                </div>
                <h1 style={{ fontWeight: 700, fontSize: 22, marginBottom: 12 }}>Check your email</h1>
                <p style={{ color: '#6B665F', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
                  If <strong>{email}</strong> is linked to a {BRAND.name} account, you&apos;ll receive a password reset link shortly.
                </p>
                <Link href="/account/login" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <>
                <h1 style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: 26, marginBottom: 8, color: '#171717' }}>
                  Reset Password
                </h1>
                <p style={{ color: '#6B665F', fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>

                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 4, padding: '12px 16px', marginBottom: 24, color: '#b91c1c', fontSize: 13 }}>
                    <AlertCircle size={16} />{error}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label htmlFor="forgot-email" style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8, color: '#171717' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6B665F', pointerEvents: 'none' }} />
                      <input
                        id="forgot-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        style={{ width: '100%', border: '1.5px solid #D8D4CD', padding: '12px 16px 12px 42px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#171717', background: '#fff' }}
                        onFocus={(e) => e.target.style.borderColor = '#171717'}
                        onBlur={(e) => e.target.style.borderColor = '#D8D4CD'}
                      />
                    </div>
                  </div>

                  <button
                    id="forgot-submit"
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Sending…' : 'Send Reset Link'}
                  </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#6B665F' }}>
                  <Link href="/account/login" style={{ color: '#171717', fontWeight: 600, textDecoration: 'underline' }}>
                    Back to Sign In
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
