'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Truck, CreditCard, Smartphone, Shield, CheckCircle } from 'lucide-react';
import { formatPrice, PK_CITIES, PAYMENT_METHODS } from '@/lib/config';
import { useCart } from '@/components/cart/CartProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const DELIVERY_FEE_PAISA = 25000; // Rs. 250
const FREE_DELIVERY_THRESHOLD_PAISA = 300000; // Rs. 3,000

export default function CheckoutPage() {
  const { items, subtotal, couponDiscount, couponCode, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  // Customer info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS.COD);

  // Coupon input (read-only display from cart)
  const [appliedCoupon] = useState(couponCode);

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD_PAISA ? 0 : DELIVERY_FEE_PAISA;
  const total = subtotal - couponDiscount + deliveryFee;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && step !== 'success') {
      router.push('/');
    }
  }, [items, step, router]);

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: fullName.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim() || null,
          deliveryAddress: address.trim(),
          deliveryCity: city,
          deliveryProvince: province.trim() || null,
          paymentMethod,
          couponCode: appliedCoupon || null,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            image: item.image,
            size: item.size,
            color: item.color,
            unitPricePaisa: item.unitPricePaisa,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setOrderId(data.orderId);
      setOrderNumber(data.orderNumber);
      clearCart();
      setStep('success');
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'success') {
    return (
      <>
        <Header />
        <main style={{ minHeight: '70vh', background: '#F4F1EB', paddingTop: 'calc(var(--announcement-height) + var(--header-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'calc(var(--announcement-height) + var(--header-height) + 48px) 24px 80px' }}>
          <div style={{ width: '100%', maxWidth: 520, background: '#fff', border: '1px solid #D8D4CD', padding: 'clamp(40px, 6vw, 64px)', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
              <CheckCircle size={32} style={{ color: '#16a34a' }} />
            </div>
            <h1 style={{ fontWeight: 700, fontSize: 'clamp(22px, 3vw, 28px)', marginBottom: 12 }}>Order Confirmed!</h1>
            <p style={{ color: '#6B665F', lineHeight: 1.7, marginBottom: 8, fontSize: 14 }}>
              Thank you for your order. We&apos;ve received your request and will start processing it shortly.
            </p>
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 28 }}>Order #{orderNumber}</p>

            {paymentMethod === PAYMENT_METHODS.COD && (
              <div style={{ background: '#F4F1EB', border: '1px solid #D8D4CD', borderRadius: 4, padding: '16px 20px', marginBottom: 28, textAlign: 'left' }}>
                <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Truck size={14} /> Cash on Delivery
                </p>
                <p style={{ fontSize: 12, color: '#6B665F' }}>
                  Please have <strong>{formatPrice(total)}</strong> ready for our delivery agent.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orderId && (
                <Link href={`/account/orders/${orderId}`} className="btn btn-primary" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
                  Track My Order
                </Link>
              )}
              <Link href="/collections/new-arrivals" className="btn btn-outline" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main id="main-content" style={{ background: '#F4F1EB', paddingTop: 'calc(var(--announcement-height) + var(--header-height) + 32px)', minHeight: '80vh' }}>
        <div className="container-wide" style={{ padding: '0 24px 80px' }}>
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, marginBottom: 32 }}>Checkout</h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28, alignItems: 'start' }}>
            {/* Left: Form */}
            <div style={{ gridColumn: '1' }}>
              <form id="checkout-form" onSubmit={handlePlaceOrder}>
                {/* Delivery Information */}
                <div style={{ background: '#fff', border: '1px solid #D8D4CD', marginBottom: 16 }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8E4DD' }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Truck size={18} /> Delivery Information
                    </h2>
                  </div>
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor="co-name" style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6, color: '#171717' }}>
                          Full Name *
                        </label>
                        <input id="co-name" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Ahmed Khan" autoComplete="name"
                          style={{ width: '100%', border: '1.5px solid #D8D4CD', padding: '11px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#171717' }}
                          onFocus={(e) => e.target.style.borderColor = '#171717'}
                          onBlur={(e) => e.target.style.borderColor = '#D8D4CD'} />
                      </div>

                      <div>
                        <label htmlFor="co-phone" style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6, color: '#171717' }}>
                          Phone Number *
                        </label>
                        <input id="co-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                          placeholder="03XX-XXXXXXX" autoComplete="tel"
                          pattern="^(\+92|0)[0-9]{9,10}$"
                          style={{ width: '100%', border: '1.5px solid #D8D4CD', padding: '11px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#171717' }}
                          onFocus={(e) => e.target.style.borderColor = '#171717'}
                          onBlur={(e) => e.target.style.borderColor = '#D8D4CD'} />
                      </div>

                      <div>
                        <label htmlFor="co-email" style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6, color: '#171717' }}>
                          Email (optional)
                        </label>
                        <input id="co-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com" autoComplete="email"
                          style={{ width: '100%', border: '1.5px solid #D8D4CD', padding: '11px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#171717' }}
                          onFocus={(e) => e.target.style.borderColor = '#171717'}
                          onBlur={(e) => e.target.style.borderColor = '#D8D4CD'} />
                      </div>

                      <div style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor="co-address" style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6, color: '#171717' }}>
                          Delivery Address *
                        </label>
                        <textarea id="co-address" required value={address} onChange={(e) => setAddress(e.target.value)}
                          placeholder="House #, Street, Area" rows={2}
                          style={{ width: '100%', border: '1.5px solid #D8D4CD', padding: '11px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#171717', resize: 'vertical' }}
                          onFocus={(e) => e.target.style.borderColor = '#171717'}
                          onBlur={(e) => e.target.style.borderColor = '#D8D4CD'} />
                      </div>

                      <div>
                        <label htmlFor="co-city" style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6, color: '#171717' }}>
                          City *
                        </label>
                        <select id="co-city" required value={city} onChange={(e) => setCity(e.target.value)}
                          style={{ width: '100%', border: '1.5px solid #D8D4CD', padding: '11px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: city ? '#171717' : '#9ca3af', background: '#fff' }}
                          onFocus={(e) => e.target.style.borderColor = '#171717'}
                          onBlur={(e) => e.target.style.borderColor = '#D8D4CD'}>
                          <option value="">Select City</option>
                          {PK_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="co-province" style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6, color: '#171717' }}>
                          Province
                        </label>
                        <input id="co-province" type="text" value={province} onChange={(e) => setProvince(e.target.value)}
                          placeholder="e.g. Punjab"
                          style={{ width: '100%', border: '1.5px solid #D8D4CD', padding: '11px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#171717' }}
                          onFocus={(e) => e.target.style.borderColor = '#171717'}
                          onBlur={(e) => e.target.style.borderColor = '#D8D4CD'} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div style={{ background: '#fff', border: '1px solid #D8D4CD', marginBottom: 16 }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8E4DD' }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CreditCard size={18} /> Payment Method
                    </h2>
                  </div>
                  <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { value: PAYMENT_METHODS.COD, label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: Truck },
                      { value: PAYMENT_METHODS.BANK_TRANSFER, label: 'Bank Transfer', desc: 'Manual bank transfer — pending until verified', icon: CreditCard },
                      { value: PAYMENT_METHODS.EASYPAISA, label: 'EasyPaisa', desc: 'Mobile wallet transfer', icon: Smartphone },
                      { value: PAYMENT_METHODS.JAZZCASH, label: 'JazzCash', desc: 'Mobile wallet transfer', icon: Smartphone },
                    ].map(({ value, label, desc, icon: Icon }) => (
                      <label
                        key={value}
                        htmlFor={`payment-${value}`}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          border: `1.5px solid ${paymentMethod === value ? '#171717' : '#D8D4CD'}`,
                          padding: '14px 18px', cursor: 'pointer',
                          background: paymentMethod === value ? '#FAFAF9' : '#fff',
                          transition: 'border-color 0.2s',
                        }}
                      >
                        <input
                          id={`payment-${value}`}
                          type="radio"
                          name="paymentMethod"
                          value={value}
                          checked={paymentMethod === value}
                          onChange={() => setPaymentMethod(value)}
                          style={{ accentColor: '#171717', width: 18, height: 18, flexShrink: 0 }}
                        />
                        <Icon size={18} style={{ flexShrink: 0, color: '#6B665F' }} />
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 14 }}>{label}</p>
                          <p style={{ fontSize: 11, color: '#6B665F' }}>{desc}</p>
                        </div>
                      </label>
                    ))}

                    {(paymentMethod === PAYMENT_METHODS.BANK_TRANSFER || paymentMethod === PAYMENT_METHODS.EASYPAISA || paymentMethod === PAYMENT_METHODS.JAZZCASH) && (
                      <div style={{ background: '#F4F1EB', border: '1px solid #D8D4CD', borderRadius: 4, padding: '14px 18px', fontSize: 13, color: '#6B665F', lineHeight: 1.6 }}>
                        <strong style={{ color: '#171717', display: 'block', marginBottom: 4 }}>Manual Transfer Instructions</strong>
                        Payment details will be shared via email/SMS after your order is placed. Your order status will remain &quot;Pending&quot; until payment is manually verified by our team.
                      </div>
                    )}
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 4, padding: '12px 16px', marginBottom: 16, color: '#b91c1c', fontSize: 13 }}>
                    <AlertCircle size={16} />{error}
                  </div>
                )}
              </form>
            </div>

            {/* Right: Order Summary */}
            <div style={{ position: 'sticky', top: 'calc(var(--announcement-height) + var(--header-height) + 24px)' }}>
              <div style={{ background: '#fff', border: '1px solid #D8D4CD' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8E4DD' }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700 }}>Order Summary</h2>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  {/* Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                    {items.map((item) => (
                      <div key={item.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <div style={{ width: 60, height: 72, background: '#F4F1EB', flexShrink: 0, overflow: 'hidden' }}>
                          {item.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{item.name}</p>
                          {(item.size || item.color) && (
                            <p style={{ fontSize: 11, color: '#6B665F', marginBottom: 4 }}>
                              {[item.size, item.color].filter(Boolean).join(' · ')}
                            </p>
                          )}
                          <p style={{ fontSize: 12, color: '#6B665F' }}>Qty: {item.quantity}</p>
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                          {formatPrice(item.unitPricePaisa * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div style={{ borderTop: '1px solid #E8E4DD', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6B665F' }}>
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#16a34a' }}>
                        <span>Coupon ({appliedCoupon})</span>
                        <span>−{formatPrice(couponDiscount)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6B665F' }}>
                      <span>Delivery</span>
                      <span>{deliveryFee === 0 ? <span style={{ color: '#16a34a' }}>Free</span> : formatPrice(deliveryFee)}</span>
                    </div>
                    {deliveryFee === 0 && (
                      <p style={{ fontSize: 11, color: '#16a34a' }}>✓ Free delivery on this order</p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, borderTop: '1px solid #E8E4DD', paddingTop: 12, marginTop: 4 }}>
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#6B665F' }}>All prices in Pakistani Rupees (PKR)</p>
                  </div>

                  {/* Place Order */}
                  <button
                    id="place-order-btn"
                    type="submit"
                    form="checkout-form"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: 24, padding: '15px', fontSize: 14, fontWeight: 700, opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Placing Order…' : `Place Order — ${formatPrice(total)}`}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14, fontSize: 11, color: '#6B665F' }}>
                    <Shield size={13} />
                    <span>Secure checkout · Your data is protected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
