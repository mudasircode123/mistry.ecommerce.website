'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { BRAND } from '@/lib/config';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/account';
  const urlError = searchParams.get('error');
  const isAdminLogin = next.includes('/admin');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    urlError === 'auth_callback_error'
      ? 'OAuth authentication callback failed. Please ensure Google Provider is configured correctly.'
      : urlError === 'unauthorized'
      ? 'Administrator authentication required to access this portal.'
      : urlError || ''
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const cleanEmail = email.trim().toLowerCase();
    const { error: err } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
    setLoading(false);

    if (err) {
      if (err.message.toLowerCase().includes('email not confirmed')) {
        setError('Your email address has not been confirmed yet. Please check your inbox or reset your password.');
      } else if (err.message === 'Invalid login credentials') {
        setError('Incorrect email or password. Please verify your credentials or reset your password.');
      } else {
        setError(err.message);
      }
      return;
    }

    router.push(next);
    router.refresh();
  }

  async function handleGoogleLogin() {
    setError('');
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (err) {
      if (err.message.toLowerCase().includes('not enabled') || err.message.toLowerCase().includes('unsupported')) {
        setError('Google Sign-In is not currently enabled. Please sign in with your email and password.');
      } else {
        setError(err.message);
      }
    }
  }

  // Purple-and-white SaaS theme for admin, storefront palette for customer login
  const theme = isAdminLogin
    ? {
        cardBg: '#FFFFFF',
        border: '#E5E7EB',
        headingColor: '#1F2937',
        subColor: '#6B7280',
        primaryBtn: '#7C3AED',
        primaryBtnHover: '#5B21B6',
        inputBorder: '#E5E7EB',
        inputFocus: '#7C3AED',
        badgeBg: '#EDE9FE',
        badgeColor: '#7C3AED',
      }
    : {
        cardBg: '#FFFFFF',
        border: '#D8D4CD',
        headingColor: '#171717',
        subColor: '#6B665F',
        primaryBtn: '#171717',
        primaryBtnHover: '#000000',
        inputBorder: '#D8D4CD',
        inputFocus: '#171717',
        badgeBg: '#F4F1EB',
        badgeColor: '#171717',
      };

  return (
    <div style={{ width: '100%', maxWidth: 460 }}>
      <div
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: isAdminLogin ? 12 : 0,
          boxShadow: isAdminLogin ? '0 10px 25px -5px rgba(124, 58, 237, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)' : 'none',
          padding: 'clamp(28px, 5vw, 44px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {isAdminLogin && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(90deg, #7C3AED 0%, #A78BFA 100%)',
            }}
          />
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h1
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 700,
              fontSize: 24,
              color: theme.headingColor,
              margin: 0,
            }}
          >
            {isAdminLogin ? 'Admin Sign In' : 'Sign In'}
          </h1>
          {isAdminLogin && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: theme.badgeBg,
                color: theme.badgeColor,
                fontSize: 11,
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: 9999,
                letterSpacing: '0.02em',
              }}
            >
              <ShieldCheck size={13} /> Secure
            </span>
          )}
        </div>

        <p style={{ color: theme.subColor, fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
          {isAdminLogin
            ? 'Administrator authentication required.'
            : 'Welcome back. Enter your details to continue.'}
        </p>

        {/* Error message */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 8,
              padding: '12px 16px',
              marginBottom: 20,
              color: '#DC2626',
              fontSize: 13,
              lineHeight: 1.45,
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <strong style={{ display: 'block', marginBottom: 2 }}>Authentication Notice</strong>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label
              htmlFor="login-email"
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: 8,
                color: theme.headingColor,
              }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: theme.subColor,
                  pointerEvents: 'none',
                }}
              />
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                style={{
                  width: '100%',
                  border: `1.5px solid ${theme.inputBorder}`,
                  borderRadius: isAdminLogin ? 8 : 0,
                  padding: '12px 16px 12px 42px',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  outline: 'none',
                  color: theme.headingColor,
                  background: '#FFFFFF',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.inputFocus;
                  if (isAdminLogin) e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.inputBorder;
                  if (isAdminLogin) e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label
                htmlFor="login-password"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: theme.headingColor,
                }}
              >
                Password
              </label>
              {!isAdminLogin && (
                <Link href="/account/forgot-password" style={{ fontSize: 12, color: theme.subColor, textDecoration: 'underline' }}>
                  Forgot password?
                </Link>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: theme.subColor,
                  pointerEvents: 'none',
                }}
              />
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  border: `1.5px solid ${theme.inputBorder}`,
                  borderRadius: isAdminLogin ? 8 : 0,
                  padding: '12px 44px 12px 42px',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  outline: 'none',
                  color: theme.headingColor,
                  background: '#FFFFFF',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.inputFocus;
                  if (isAdminLogin) e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.inputBorder;
                  if (isAdminLogin) e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                aria-label={showPass ? 'Hide password' : 'Show password'}
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: theme.subColor,
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px 20px',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '0.02em',
              background: theme.primaryBtn,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: isAdminLogin ? 8 : 0,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
              transition: 'background-color 0.2s, transform 0.1s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            onMouseOver={(e) => {
              if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = theme.primaryBtnHover;
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = theme.primaryBtn;
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    display: 'inline-block',
                    width: 14,
                    height: 14,
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#FFFFFF',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                Authenticating…
              </>
            ) : isAdminLogin ? (
              'Enter Admin Dashboard'
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {!isAdminLogin && (
          <>
            <div style={{ position: 'relative', margin: '24px 0', textAlign: 'center' }}>
              <div style={{ borderTop: `1px solid ${theme.border}`, position: 'absolute', top: '50%', left: 0, right: 0 }} />
              <span style={{ background: '#FFFFFF', padding: '0 16px', position: 'relative', fontSize: 12, color: theme.subColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                or
              </span>
            </div>

            <button
              id="login-google"
              type="button"
              onClick={handleGoogleLogin}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                background: '#FFFFFF',
                border: `1px solid ${theme.border}`,
                color: theme.headingColor,
                cursor: 'pointer',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Continue with Google
            </button>

            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: theme.subColor }}>
              Don&apos;t have an account?{' '}
              <Link href="/account/register" style={{ color: theme.headingColor, fontWeight: 600, textDecoration: 'underline' }}>
                Create one
              </Link>
            </p>
          </>
        )}
      </div>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: theme.subColor }}>
        <Link href="/" style={{ color: theme.subColor, textDecoration: 'none' }}>← Back to {BRAND.name}</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      {/* Minimal header */}
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Link
            href="/"
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 900,
              fontSize: 22,
              letterSpacing: '0.18em',
              color: '#1F2937',
              textDecoration: 'none',
            }}
          >
            {BRAND.name}
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', color: '#6B7280', fontSize: 14 }}>Loading sign in...</div>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
