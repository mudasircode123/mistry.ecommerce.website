'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Lock, Save, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/components/ui/ToastProvider';


import { useRouter } from 'next/navigation';

export default function AccountSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile fields
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  // Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/account/login?next=/account/settings');
        return;
      }

      setEmail(user.email || '');

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || '');
        setPhone(profile.phone || '');
        setIsAdmin(profile.role === 'admin');
      }
      setLoading(false);
    }

    loadProfile();
  }, [router, supabase]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileMsg(null);
    setSavingProfile(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfileMsg({ type: 'success', text: 'Profile details updated successfully.' });
      toast('Profile updated');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      setProfileMsg({ type: 'error', text: msg });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
      setNewPassword('');
      setConfirmPassword('');
      toast('Password changed successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update password';
      setPasswordMsg({ type: 'error', text: msg });
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <>
      <Header />
      <main id="main-content" style={{ minHeight: '60vh', background: '#F4F1EB', paddingTop: 'calc(var(--announcement-height) + var(--header-height))' }}>
        {/* Header */}
        <div style={{ background: '#171717', color: '#fff', padding: 'clamp(28px, 4vw, 48px) 0' }}>
          <div className="container-wide">
            <Link
              href="/account"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: 'rgba(255,255,255,0.7)',
                fontSize: 13,
                marginBottom: 16,
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={16} /> Back to My Account
            </Link>
            <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700 }}>Account Settings</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>
              Manage personal profile and security credentials
            </p>
          </div>
        </div>

        <div className="container-wide" style={{ padding: 'clamp(32px, 4vw, 56px) 24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B665F' }}>Loading profile...</div>
          ) : (
            <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
              {/* Profile Card */}
              <div style={{ background: '#fff', border: '1px solid #D8D4CD', padding: 'clamp(24px, 3vw, 36px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <User size={20} />
                    <h2 style={{ fontSize: 18, fontWeight: 700 }}>Personal Information</h2>
                  </div>
                  {isAdmin && (
                    <span style={{ background: '#171717', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <ShieldCheck size={13} /> Administrator
                    </span>
                  )}
                </div>

                {profileMsg && (
                  <div
                    style={{
                      padding: '12px 16px',
                      background: profileMsg.type === 'success' ? '#DCFCE7' : '#FEE2E2',
                      color: profileMsg.type === 'success' ? '#16A34A' : '#DC2626',
                      borderRadius: 4,
                      fontSize: 13,
                      marginBottom: 20,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    {profileMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {profileMsg.text}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="input-field"
                      style={{ background: '#F4F1EB', cursor: 'not-allowed', color: '#6B665F' }}
                    />
                    <span style={{ fontSize: 11, color: '#8A8A8A', marginTop: 4, display: 'block' }}>Email cannot be changed</span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="03001234567"
                      className="input-field"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn btn-primary"
                    style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', marginTop: 6 }}
                  >
                    <Save size={15} /> {savingProfile ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>
              </div>

              {/* Password Card */}
              <div style={{ background: '#fff', border: '1px solid #D8D4CD', padding: 'clamp(24px, 3vw, 36px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <Lock size={20} />
                  <h2 style={{ fontSize: 18, fontWeight: 700 }}>Security & Password</h2>
                </div>

                {passwordMsg && (
                  <div
                    style={{
                      padding: '12px 16px',
                      background: passwordMsg.type === 'success' ? '#DCFCE7' : '#FEE2E2',
                      color: passwordMsg.type === 'success' ? '#16A34A' : '#DC2626',
                      borderRadius: 4,
                      fontSize: 13,
                      marginBottom: 20,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    {passwordMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {passwordMsg.text}
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="input-field"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="btn btn-outline"
                    style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', marginTop: 6 }}
                  >
                    <Lock size={15} /> {savingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
