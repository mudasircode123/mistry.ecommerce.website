'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { BRAND } from '@/lib/config';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    async function checkRecoverySession() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setHasSession(true);
      }
      setCheckingSession(false);
    }
    checkRecoverySession();
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/account/login');
      }, 3000);
    }
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
            {success ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <CheckCircle size={28} style={{ color: '#16a34a' }} />
                </div>
                <h1 style={{ fontWeight: 700, fontSize: 22, marginBottom: 12 }}>Password updated</h1>
                <p style={{ color: '#6B665F', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
                  Your password has been reset successfully. Redirecting to sign in...
                </p>
                <Link href="/account/login" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                  Sign In Now
                </Link>
              </div>
            ) : checkingSession ? (
              <div style={{ textAlign: 'center', color: '#6B665F', padding: '24px 0' }}>
                Verifying recovery session...
              </div>
            ) : !hasSession ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <AlertCircle size={28} style={{ color: '#dc2626' }} />
                </div>
                <h1 style={{ fontWeight: 700, fontSize: 22, marginBottom: 12 }}>Link Expired or Invalid</h1>
                <p style={{ color: '#6B665F', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
                  The password reset link is invalid or has expired. Please request a new link.
                </p>
                <Link href="/account/forgot-password" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                  Request New Link
                </Link>
              </div>
            ) : (
              <>
                <h1 style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: 26, marginBottom: 8, color: '#171717' }}>
                  Set New Password
                </h1>
                <p style={{ color: '#6B665F', fontSize: 14, marginBottom: 28 }}>
                  Please enter and confirm your new password below.
                </p>

                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 4, padding: '12px 16px', marginBottom: 24, color: '#b91c1c', fontSize: 13 }}>
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label htmlFor="new-pass" style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8, color: '#171717' }}>
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6B665F', pointerEvents: 'none' }} />
                      <input
                        id="new-pass"
                        type={showPass ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        style={{ width: '100%', border: '1.5px solid #D8D4CD', padding: '12px 44px 12px 42px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#171717', background: '#fff' }}
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
                  </div>

                  <div>
                    <label htmlFor="confirm-pass" style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8, color: '#171717' }}>
                      Confirm New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6B665F', pointerEvents: 'none' }} />
                      <input
                        id="confirm-pass"
                        type={showPass ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        style={{ width: '100%', border: '1.5px solid #D8D4CD', padding: '12px 44px 12px 42px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#171717', background: '#fff' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Updating Password…' : 'Update Password'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
