import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BRAND } from '@/lib/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Privacy Policy — ${BRAND.name}`,
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main style={{ background: '#F4F1EB', paddingTop: 'calc(var(--announcement-height) + var(--header-height))' }}>
        <div style={{ background: '#171717', padding: 'clamp(32px, 5vw, 56px) 0', color: '#fff', marginBottom: 0 }}>
          <div className="container-wide">
            <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700 }}>Privacy Policy</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>Last updated: October 2026</p>
          </div>
        </div>
        <div className="container-wide" style={{ maxWidth: 760, padding: 'clamp(40px, 5vw, 64px) 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, color: '#171717', fontSize: 15, lineHeight: 1.8 }}>
            {[
              {
                title: '1. Information We Collect',
                content: `When you create an account or place an order on ${BRAND.name}, we collect your name, email address, phone number, and delivery address. We also collect anonymised usage data (pages visited, device type) to improve the website.`,
              },
              {
                title: '2. How We Use Your Information',
                content: `We use your information to process and deliver orders, send order confirmation and shipping notifications, respond to customer service inquiries, and improve our products and website.`,
              },
              {
                title: '3. Data Storage',
                content: `Your data is securely stored in Supabase (EU data centre) and is encrypted in transit (HTTPS). We do not store complete payment card numbers. Cash on Delivery orders record only the agreed amount.`,
              },
              {
                title: '4. Data Sharing',
                content: `We do not sell your personal data. We share only the minimum necessary information with our delivery couriers to fulfil orders. Order summaries are exported to a private Google Sheets spreadsheet accessible only to authorised ${BRAND.name} team members.`,
              },
              {
                title: '5. Cookies',
                content: `We use functional cookies to keep you signed in and to remember your shopping cart. We do not use advertising cookies. You can clear cookies at any time through your browser settings.`,
              },
              {
                title: '6. Your Rights',
                content: `You may request a copy of your data, request correction of inaccurate data, or request deletion of your account by contacting us at ${BRAND.contactEmail}. We will respond within 30 days.`,
              },
              {
                title: '7. Contact',
                content: `For privacy-related questions, contact us at ${BRAND.contactEmail}.`,
              },
            ].map(({ title, content }) => (
              <section key={title}>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{title}</h2>
                <p style={{ color: '#444' }}>{content}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
