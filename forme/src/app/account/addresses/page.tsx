'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/components/ui/ToastProvider';

interface Address {
  id: string;
  profile_id: string;
  label: string | null;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  province: string | null;
  postal_code: string | null;
  is_default: boolean;
  created_at: string;
}

const CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad'
];

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Form states
  const [label, setLabel] = useState('Home');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState(CITIES[0]);
  const [province] = useState('Punjab');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const fetchAddresses = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/account/login?next=/account/addresses');
        return;
      }

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('profile_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAddresses(data as Address[]);
      }
    } finally {
      setLoading(false);
    }
  }, [router, supabase]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !phone.trim() || !addressLine1.trim() || !city.trim()) {
      setError('Please fill in all required fields (Name, Phone, Address, City).');
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in');

      // If set as default, clear other defaults first
      if (isDefault || addresses.length === 0) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('profile_id', user.id);
      }

      const { error: insertError } = await supabase
        .from('addresses')
        .insert({
          profile_id: user.id,
          label: label.trim() || 'Home',
          full_name: fullName.trim(),
          phone: phone.trim(),
          address_line1: addressLine1.trim(),
          address_line2: addressLine2.trim() || null,
          city: city.trim(),
          province: province.trim() || null,
          postal_code: postalCode.trim() || null,
          is_default: isDefault || addresses.length === 0,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast('Address added successfully');
      setShowAddForm(false);
      // Reset form
      setFullName('');
      setPhone('');
      setAddressLine1('');
      setAddressLine2('');
      setPostalCode('');
      setIsDefault(false);
      fetchAddresses();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save address';
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to remove this address?')) return;
    try {
      const { error } = await supabase.from('addresses').delete().eq('id', id);
      if (error) throw error;
      toast('Address removed');
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete address';
      toast(msg);
    }
  }

  async function handleSetDefault(id: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Unset all
      await supabase.from('addresses').update({ is_default: false }).eq('profile_id', user.id);
      // 2. Set this one
      await supabase.from('addresses').update({ is_default: true }).eq('id', id);

      toast('Default address updated');
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          is_default: a.id === id,
        }))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to set default';
      toast(msg);
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700 }}>Saved Addresses</h1>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>
                  Manage delivery addresses for seamless checkout
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn btn-primary"
                style={{ background: '#fff', color: '#171717', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <Plus size={16} /> {showAddForm ? 'Cancel' : 'Add New Address'}
              </button>
            </div>
          </div>
        </div>

        <div className="container-wide" style={{ padding: 'clamp(32px, 4vw, 56px) 24px' }}>
          {/* Add Form */}
          {showAddForm && (
            <div style={{ background: '#fff', border: '1px solid #D8D4CD', padding: 'clamp(20px, 3vw, 32px)', marginBottom: 32 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Add New Address</h2>
              {error && (
                <div style={{ padding: '12px 16px', background: '#FEE2E2', color: '#DC2626', fontSize: 13, borderRadius: 4, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              <form onSubmit={handleAddAddress} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                      Address Label
                    </label>
                    <input
                      type="text"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder="e.g. Home, Office"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Recipient full name"
                      className="input-field"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="03001234567"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                      City *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="input-field"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="House/Apartment #, Street, Area"
                    className="input-field"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Nearby landmark, Floor, etc."
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                      Postal Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 54000"
                      className="input-field"
                    />
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: '#171717', margin: '4px 0' }}>
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                  />
                  <span>Set as default delivery address</span>
                </label>

                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '10px 24px' }}>
                    {saving ? 'Saving...' : 'Save Address'}
                  </button>
                  <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-outline" style={{ padding: '10px 20px' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Address Cards */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B665F' }}>Loading addresses...</div>
          ) : addresses.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #D8D4CD', padding: '64px 24px', textAlign: 'center', color: '#6B665F' }}>
              <MapPin size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#171717', marginBottom: 8 }}>No addresses saved</h2>
              <p style={{ fontSize: 14, marginBottom: 24 }}>Add your shipping details to speed up future checkouts.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <Plus size={16} /> Add Address
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  style={{
                    background: '#fff',
                    border: addr.is_default ? '2px solid #171717' : '1px solid #D8D4CD',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                  }}
                >
                  {addr.is_default && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: '#171717',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: 999,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Default
                    </span>
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <MapPin size={16} />
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{addr.label || 'Delivery Address'}</span>
                    </div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#171717', marginBottom: 4 }}>{addr.full_name}</p>
                    <p style={{ fontSize: 13, color: '#6B665F', marginBottom: 8 }}>{addr.phone}</p>
                    <p style={{ fontSize: 13, color: '#171717', lineHeight: 1.5 }}>
                      {addr.address_line1}
                      {addr.address_line2 ? `, ${addr.address_line2}` : ''}
                      <br />
                      {addr.city}{addr.province ? `, ${addr.province}` : ''} {addr.postal_code || ''}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '1px solid #F0EEE9' }}>
                    {!addr.is_default ? (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        style={{ background: 'none', border: 'none', color: '#171717', fontSize: 12, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: '#059669', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                        <CheckCircle2 size={14} /> Default address
                      </span>
                    )}

                    <button
                      onClick={() => handleDelete(addr.id)}
                      style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
