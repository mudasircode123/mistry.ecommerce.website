import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BRAND } from '@/lib/config';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: `Frequently Asked Questions — ${BRAND.name}`,
  description: `Answers to common questions regarding ordering, sizing, delivery, and payments.`,
};

const FAQS = [
  { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD) throughout Pakistan, as well as Bank Transfer, Easypaisa, and JazzCash.' },
  { q: 'How long does delivery take?', a: 'Major metropolitan cities (Lahore, Karachi, Islamabad, Rawalpindi) typically take 2-4 business days. Regional towns take 3-6 days.' },
  { q: 'Do you offer free delivery?', a: 'Yes! All orders of Rs. 3,000 and above qualify for 100% Free Nationwide Delivery automatically.' },
  { q: 'How can I choose the right size?', a: 'Our clothing follows modern streetwear boxy and relaxed fits, while our shoes use standard EU sizing (39–45). If between sizes, we recommend sizing up.' },
  { q: 'Can I exchange an item if it doesn’t fit?', a: 'Yes, we offer hassle-free 7-day size exchanges on all unworn items with intact original tags.' },
];

export default function FAQPage() {
  return (
    <>
      <Header />
      <main style={{ background: '#F4F1EB', minHeight: '80vh', paddingTop: 'calc(var(--announcement-height) + var(--header-height))' }}>
        <div style={{ background: '#171717', padding: 'clamp(40px, 6vw, 64px) 0', color: '#fff' }}>
          <div className="container-wide">
            <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800 }}>Frequently Asked Questions</h1>
            <p style={{ color: '#A3A3A3', fontSize: 13, marginTop: 8 }}>Quick answers to your most common questions</p>
          </div>
        </div>
        <div className="container-wide" style={{ maxWidth: 800, padding: 'clamp(40px, 5vw, 64px) 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FAQS.map((item, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid #D8D4CD', padding: '24px', borderRadius: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#171717', marginBottom: 8 }}>{item.q}</h3>
                <p style={{ color: '#4B5563', fontSize: 14, lineHeight: 1.6 }}>{item.a}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40, color: '#4B5563', fontSize: 14 }}>
            Still have questions? <Link href="/contact" style={{ color: '#171717', fontWeight: 700, textDecoration: 'underline' }}>Contact Our Support Team</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
