import type { Metadata } from 'next';
import './globals.css';
import { BRAND } from '@/lib/config';
import { CartProvider } from '@/components/cart/CartProvider';
import { WishlistProvider } from '@/components/wishlist/WishlistProvider';
import { ToastProvider } from '@/components/ui/ToastProvider';

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: `${BRAND.name} is Pakistan's premier destination for premium fashion, streetwear, and designer sneakers. Shop the latest collections in PKR with Cash on Delivery across Pakistan.`,
  keywords: ['fashion Pakistan', 'streetwear', 'sneakers Pakistan', 'clothing online', 'PKR', 'premium fashion'],
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    siteName: BRAND.name,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
