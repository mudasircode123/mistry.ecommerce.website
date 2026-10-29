import {
  MessageSquare, Mail, Phone,
  Clock
} from 'lucide-react';
import { BRAND } from '@/lib/config';
import { requireAdmin } from '@/lib/auth/admin';
import type { Metadata } from 'next';
import InquiryStatusSelect from './InquiryStatusSelect';

export const metadata: Metadata = {
  title: `Customer Inquiries — Admin — ${BRAND.name}`,
};

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  category: string;
  subject?: string | null;
  order_number?: string | null;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
}

export default async function AdminInquiriesPage() {
  const { supabase } = await requireAdmin('/admin/inquiries');

  let inquiries: Inquiry[] = [];
  try {
    const { data } = await supabase
      .from('inquiries')
      .select('id, name, email, phone, category, subject, order_number, message, status, created_at')
      .order('created_at', { ascending: false });
    inquiries = (data as Inquiry[]) || [];
  } catch (err) {
    console.error('Error fetching inquiries:', err);
  }

  const newCount = inquiries.filter((i) => i.status === 'new').length;
  const inProgressCount = inquiries.filter((i) => i.status === 'in_progress').length;
  const resolvedCount = inquiries.filter((i) => i.status === 'resolved').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', letterSpacing: '-0.02em', margin: 0 }}>
            Customer Inquiries
          </h1>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 4, margin: '4px 0 0' }}>
            Live customer questions, support tickets, and form submissions from your storefront.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            background: '#EDE9FE',
            color: '#7C3AED',
            padding: '6px 14px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}>
            <MessageSquare size={13} />
            {inquiries.length} Total Submissions
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 16 }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>New / Unread</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#DC2626', marginTop: 4 }}>{newCount}</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Progress</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#D97706', marginTop: 4 }}>{inProgressCount}</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resolved</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#16A34A', marginTop: 4 }}>{resolvedCount}</div>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          padding: '64px 24px',
          textAlign: 'center',
          color: '#6B7280',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#EDE9FE',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16
          }}>
            <MessageSquare size={24} color="#7C3AED" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', marginBottom: 6 }}>No inquiries yet</h3>
          <p style={{ fontSize: 13, color: '#6B7280', maxWidth: 420, margin: '0 auto' }}>
            When customers submit questions or forms on the storefront, they will sync securely to your dashboard here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              style={{
                background: '#FFFFFF',
                border: inq.status === 'new' ? '1px solid #DDD6FE' : '1px solid #E5E7EB',
                borderLeft: inq.status === 'new' ? '4px solid #7C3AED' : '4px solid #E5E7EB',
                borderRadius: 12,
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                boxShadow: inq.status === 'new' ? '0 4px 12px rgba(124,58,237,0.06)' : '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: 0 }}>
                      {inq.name}
                    </h3>
                    <span
                      style={{
                        fontSize: 11,
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: '#EDE9FE',
                        color: '#7C3AED',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        fontWeight: 700,
                      }}
                    >
                      {inq.category.replace('_', ' ')}
                    </span>
                    {inq.order_number && (
                      <span style={{ fontSize: 12, color: '#5B21B6', fontWeight: 600, background: '#F5F3FF', padding: '2px 8px', borderRadius: 4 }}>
                        Order #{inq.order_number}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: '#6B7280', flexWrap: 'wrap' }}>
                    <a href={`mailto:${inq.email}`} style={{ color: '#7C3AED', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                      <Mail size={13} /> {inq.email}
                    </a>
                    {inq.phone && (
                      <a href={`tel:${inq.phone}`} style={{ color: '#4B5563', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Phone size={13} /> {inq.phone}
                      </a>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#9CA3AF' }}>
                      <Clock size={12} /> {new Date(inq.created_at).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <InquiryStatusSelect id={inq.id} currentStatus={inq.status} />
                </div>
              </div>

              {inq.subject && (
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', borderTop: '1px solid #F3F4F6', paddingTop: 10 }}>
                  Subject: <span style={{ color: '#4B5563', fontWeight: 500 }}>{inq.subject}</span>
                </div>
              )}

              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                padding: '14px 18px',
                borderRadius: 8,
                fontSize: 13.5,
                color: '#334155',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap'
              }}>
                {inq.message}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4, flexWrap: 'wrap' }}>
                <a
                  href={`mailto:${inq.email}?subject=RE: ${encodeURIComponent(inq.subject || 'Your FORME Inquiry')}&body=Dear ${encodeURIComponent(inq.name)},%0D%0A%0D%0AThank you for contacting FORME.`}
                  style={{
                    padding: '8px 16px',
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 6,
                    background: '#7C3AED',
                    color: '#FFFFFF',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    textDecoration: 'none',
                    boxShadow: '0 1px 2px rgba(124,58,237,0.2)'
                  }}
                >
                  <Mail size={13} /> Reply via Email
                </a>
                {inq.phone && (
                  <a
                    href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(inq.name)},%20this%20is%20FORME%20Customer%20Care%20regarding%20your%20inquiry.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '8px 16px',
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 6,
                      background: '#FFFFFF',
                      border: '1px solid #16A34A',
                      color: '#16A34A',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      textDecoration: 'none'
                    }}
                  >
                    WhatsApp Customer
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
