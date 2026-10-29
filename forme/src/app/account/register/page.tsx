'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { BRAND } from '@/lib/config';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') ?? '';
  const next = searchParams.get('next') ?? '/account';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const cleanEmail = email.trim().toLowerCase();

    const { data, error: err } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      if (data?.session) {
        router.push(next);
        router.refresh();
      } else {
        setSuccess(true);
      }
    }
  }

  if (success) {
    return (
      <div style={{ width: '100%', maxWidth: 440, background: '#fff', border: '1px solid #D8D4CD', padding: 'clamp(32px, 5vw, 48px)', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={28} style={{ color: '#16a34a' }} />
        </div>
        <h1 style={{ fontWeight: 700, fontSize: 22, marginBottom: 12 }}>
          Account Created
        </h1>
        <p style={{ color: '#6B665F', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
          Welcome to {BRAND.name}! Your account <strong>{email}</strong> is ready. Please check your inbox if email verification was sent, or sign in below.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link
            href="/account/login"
            className="btn btn-primary"
            style={{ textDecoration: 'none', display: 'inline-flex' }}
          >
            Sign In Now
          </Link>
          <Link href="/" className="btn btn-outline" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <div style={{ background: '#fff', border: '1px solid #D8D4CD', padding: 'clamp(32px, 5vw, 48px)' }}>
        <h1 style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: 26, marginBottom: 8, color: '#171717' }}>
          Create Account
        </h1>
        <p style={{ color: '#6B665F', fontSize: 14, marginBottom: 24 }}>
          Join {BRAND.name} for a personalised shopping experience.
        </p>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 4, padding: '12px 16px', marginBottom: 24, color: '#b91c1c', fontSize: 13 }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label htmlFor="reg-name" style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8, color: '#171717' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6B665F', pointerEvents: 'none' }} />
              <input
                id="reg-name"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                style={{ width: '100%', border: '1.5px solid #D8D4CD', padding: '12px 16px 12px 42px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#171717', background: '#fff' }}
                onFocus={(e) => e.target.style.borderColor = '#171717'}
                onBlur={(e) => e.target.style.borderColor = '#D8D4CD'}
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8, color: '#171717' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6B665F', pointerEvents: 'none' }} />
              <input
                id="reg-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ width: '100%', border: '1.5px solid #D8D4CD', padding: '12px 16px 12px 42px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#171717', background: '#fff' }}
                onFocus={(e) => e.target.style.borderColor = '#171717'}
                onBlur={(e) => e.target.style.borderColor = '#D8D4CD'}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label htmlFor="reg-password" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#171717' }}>
                Password
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6B665F', pointerEvents: 'none' }} />
              <input
                id="reg-password"
                type={showPass ? 'text' : 'password'}
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                style={{ width: '100%', border: '1.5px solid #D8D4CD', padding: '12px 44px 12px 42px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#171717', background: '#fff' }}
                onFocus={(e) => e.target.style.borderColor = '#171717'}
                onBlur={(e) => e.target.style.borderColor = '#D8D4CD'}
              />
              <button
                type="button"
                aria-label={showPass ? 'Hide password' : 'Show password'}
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B665F', padding: 0 }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p style={{ fontSize: 11, color: '#6B665F', marginTop: 6 }}>At least 8 characters</p>
          </div>

          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ fontSize: 12, color: '#6B665F', textAlign: 'center', marginTop: 20, lineHeight: 1.6 }}>
          By creating an account, you agree to our{' '}
          <Link href="/terms" style={{ color: '#171717', textDecoration: 'underline' }}>Terms of Service</Link>{' '}
          and{' '}
          <Link href="/privacy" style={{ color: '#171717', textDecoration: 'underline' }}>Privacy Policy</Link>.
        </p>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#6B665F' }}>
          Already have an account?{' '}
          <Link
            href="/account/login"
            style={{ color: '#171717', fontWeight: 600, textDecoration: 'underline' }}
          >
            Sign in
          </Link>
        </p>
      </div>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#6B665F' }}>
        <Link href="/" style={{ color: '#6B665F' }}>← Back to {BRAND.name}</Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
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
        <Suspense fallback={<div style={{ textAlign: 'center', color: '#6B665F', fontSize: 14 }}>Loading registration form...</div>}>
          <RegisterForm />
        </Suspense>
      </main>
    </div>
  );
}
