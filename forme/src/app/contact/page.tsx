'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { BRAND } from '@/lib/config';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<'general' | 'order_inquiry' | 'returns' | 'wholesale' | 'feedback'>('general');
  const [orderNumber, setOrderNumber] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          category,
          orderNumber,
          subject: subject || `${category.replace('_', ' ').toUpperCase()} Inquiry`,
          message,
          source: 'contact_page',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
      }

      setInquiryId(data.inquiryId || '');
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setName('');
    setEmail('');
    setPhone('');
    setCategory('general');
    setOrderNumber('');
    setSubject('');
    setMessage('');
    setSubmitted(false);
    setInquiryId('');
    setError('');
  }

  return (
    <>
      <Header />
      <main
        id="main-content"
        style={{
          background: '#F4F1EB',
          minHeight: '85vh',
          paddingTop: 'calc(var(--announcement-height) + var(--header-height) + 40px)',
          paddingBottom: '80px',
        }}
      >
        <div className="container-wide" style={{ padding: '0 24px' }}>
          {/* Header Banner */}
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
            <span
              className="label-caps"
              style={{
                display: 'inline-block',
                background: '#171717',
                color: '#FFFFFF',
                padding: '4px 12px',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                marginBottom: 16,
              }}
            >
              CLIENT SERVICES
            </span>
            <h1
              style={{
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 800,
                color: '#171717',
                lineHeight: 1.15,
                marginBottom: 16,
                letterSpacing: '-0.02em',
              }}
            >
              How Can We Assist You?
            </h1>
            <p style={{ color: '#6B665F', fontSize: 15, lineHeight: 1.65 }}>
              Whether you have a question regarding sizes, custom orders, order tracking, or exchange policies,
              our Lahore client care team is here to help.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 40,
              alignItems: 'start',
            }}
          >
            {/* Left: Contact Form */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #D8D4CD',
                padding: 'clamp(28px, 4vw, 44px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              }}
            >
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '24px 8px' }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: '#f0fdf4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                    }}
                  >
                    <CheckCircle size={32} style={{ color: '#16a34a' }} />
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: '#171717', marginBottom: 12 }}>
                    Inquiry Received
                  </h2>
                  <p style={{ color: '#6B665F', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                    Thank you, <strong>{name}</strong>. Your inquiry has been securely saved in our database. Our
                    client advisory team will reach out to <strong>{email}</strong> within 24 business hours.
                  </p>
                  {inquiryId && (
                    <div
                      style={{
                        background: '#F4F1EB',
                        border: '1px solid #D8D4CD',
                        padding: '12px 16px',
                        fontSize: 13,
                        color: '#171717',
                        marginBottom: 28,
                      }}
                    >
                      Reference ID: <code style={{ fontWeight: 700 }}>{inquiryId.slice(0, 13)}...</code>
                    </div>
                  )}
                  <button
                    onClick={handleReset}
                    className="btn btn-outline"
                    style={{ minWidth: 200 }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#171717', marginBottom: 4 }}>
                    Submit an Inquiry
                  </h2>
                  <p style={{ color: '#6B665F', fontSize: 13, marginBottom: 12 }}>
                    Fill out the form below and all details will be dispatched directly to our support team.
                  </p>

                  {error && (
                    <div
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        color: '#dc2626',
                        fontSize: 13,
                      }}
                    >
                      <AlertCircle size={16} style={{ flexShrink: 0 }} />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Name & Email Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label
                        htmlFor="inq-name"
                        style={{
                          display: 'block',
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          marginBottom: 6,
                          color: '#171717',
                        }}
                      >
                        Full Name *
                      </label>
                      <input
                        id="inq-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Bilal Farooq"
                        style={{
                          width: '100%',
                          border: '1.5px solid #D8D4CD',
                          padding: '11px 14px',
                          fontSize: 14,
                          color: '#171717',
                          outline: 'none',
                          background: '#fff',
                        }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="inq-email"
                        style={{
                          display: 'block',
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          marginBottom: 6,
                          color: '#171717',
                        }}
                      >
                        Email Address *
                      </label>
                      <input
                        id="inq-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        style={{
                          width: '100%',
                          border: '1.5px solid #D8D4CD',
                          padding: '11px 14px',
                          fontSize: 14,
                          color: '#171717',
                          outline: 'none',
                          background: '#fff',
                        }}
                      />
                    </div>
                  </div>

                  {/* Phone & Category */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label
                        htmlFor="inq-phone"
                        style={{
                          display: 'block',
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          marginBottom: 6,
                          color: '#171717',
                        }}
                      >
                        Phone / WhatsApp
                      </label>
                      <input
                        id="inq-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0300-1234567"
                        style={{
                          width: '100%',
                          border: '1.5px solid #D8D4CD',
                          padding: '11px 14px',
                          fontSize: 14,
                          color: '#171717',
                          outline: 'none',
                          background: '#fff',
                        }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="inq-category"
                        style={{
                          display: 'block',
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          marginBottom: 6,
                          color: '#171717',
                        }}
                      >
                        Inquiry Topic *
                      </label>
                      <select
                        id="inq-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as typeof category)}
                        style={{
                          width: '100%',
                          border: '1.5px solid #D8D4CD',
                          padding: '11px 14px',
                          fontSize: 14,
                          color: '#171717',
                          outline: 'none',
                          background: '#fff',
                        }}
                      >
                        <option value="general">General Question</option>
                        <option value="order_inquiry">Order Status / Delivery</option>
                        <option value="returns">Returns & Exchanges</option>
                        <option value="wholesale">Wholesale & Bulk Orders</option>
                        <option value="feedback">Product Feedback</option>
                      </select>
                    </div>
                  </div>

                  {/* Order number if order related */}
                  {(category === 'order_inquiry' || category === 'returns') && (
                    <div>
                      <label
                        htmlFor="inq-order"
                        style={{
                          display: 'block',
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          marginBottom: 6,
                          color: '#171717',
                        }}
                      >
                        Order Number (if applicable)
                      </label>
                      <input
                        id="inq-order"
                        type="text"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        placeholder="e.g. FRM-12345"
                        style={{
                          width: '100%',
                          border: '1.5px solid #D8D4CD',
                          padding: '11px 14px',
                          fontSize: 14,
                          color: '#171717',
                          outline: 'none',
                          background: '#fff',
                        }}
                      />
                    </div>
                  )}

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="inq-subject"
                      style={{
                        display: 'block',
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: 6,
                        color: '#171717',
                      }}
                    >
                      Subject
                    </label>
                    <input
                      id="inq-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief summary of your question"
                      style={{
                        width: '100%',
                        border: '1.5px solid #D8D4CD',
                        padding: '11px 14px',
                        fontSize: 14,
                        color: '#171717',
                        outline: 'none',
                        background: '#fff',
                      }}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="inq-message"
                      style={{
                        display: 'block',
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: 6,
                        color: '#171717',
                      }}
                    >
                      Detailed Message *
                    </label>
                    <textarea
                      id="inq-message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please provide as much detail as possible so we can assist you quickly..."
                      style={{
                        width: '100%',
                        border: '1.5px solid #D8D4CD',
                        padding: '12px 14px',
                        fontSize: 14,
                        color: '#171717',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        background: '#fff',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '14px 28px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? (
                      'Saving Inquiry...'
                    ) : (
                      <>
                        <Send size={16} /> Send Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Direct Channels & Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Card 1: Direct Support */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #D8D4CD',
                  padding: '32px',
                }}
              >
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: '#171717',
                    marginBottom: 20,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Direct Channels
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <a
                    href={`mailto:${BRAND.contactEmail}`}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 14,
                      color: '#171717',
                      textDecoration: 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 4,
                        background: '#F4F1EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Mail size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#6B665F', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Email Concierge
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{BRAND.contactEmail}</div>
                      <div style={{ fontSize: 12, color: '#6B665F' }}>Replies typically within 4 hours</div>
                    </div>
                  </a>

                  <a
                    href={`tel:${BRAND.contactPhone.replace(/\s/g, '')}`}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 14,
                      color: '#171717',
                      textDecoration: 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 4,
                        background: '#F4F1EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Phone size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#6B665F', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Customer Support Line
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{BRAND.contactPhone}</div>
                      <div style={{ fontSize: 12, color: '#6B665F' }}>Mon – Sat, 10:00 AM – 8:00 PM PKT</div>
                    </div>
                  </a>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 14,
                      color: '#171717',
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 4,
                        background: '#F4F1EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#6B665F', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Headquarters & Fulfillment
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>Gulberg III, Lahore</div>
                      <div style={{ fontSize: 12, color: '#6B665F' }}>Punjab, Pakistan</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Response Commitment */}
              <div
                style={{
                  background: '#171717',
                  color: '#FFFFFF',
                  padding: '32px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Clock size={18} style={{ color: '#E8E4DD' }} />
                  <h4 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.04em' }}>Our Service Guarantee</h4>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 16 }}>
                  Every customer inquiry submitted through this portal is logged in our centralized Supabase
                  backend and assigned directly to a dedicated representative.
                </p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 16, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                  Cash on Delivery orders can also be confirmed via phone or WhatsApp.
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
