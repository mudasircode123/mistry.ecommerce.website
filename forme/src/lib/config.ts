// Brand configuration — change NEXT_PUBLIC_BRAND_NAME in .env.local to rebrand

export const BRAND = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME ?? 'FORME',
  tagline: process.env.NEXT_PUBLIC_BRAND_TAGLINE ?? 'Premium Fashion & Streetwear',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  country: 'Pakistan',
  contactEmail: 'hello@forme.pk',
  contactPhone: '+92 300 0000000',
  instagramHandle: '@forme.pk',
  facebookHandle: 'forme.pk',
} as const;

// Format price in PKR
export function formatPrice(
  paisa: number,
  opts: { showSymbol?: boolean } = {}
): string {
  const { showSymbol = true } = opts;
  const amount = paisa / 100;
  const formatted = new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return showSymbol ? `${BRAND.currencySymbol} ${formatted}` : formatted;
}

// Common Pakistani cities
export const PK_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Sargodha', 'Sukkur',
] as const;

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
} as const;

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// Payment methods
export const PAYMENT_METHODS = {
  COD: 'cod',
  BANK_TRANSFER: 'bank_transfer',
  EASYPAISA: 'easypaisa',
  JAZZCASH: 'jazzcash',
} as const;

// Welcome coupon
export const WELCOME_COUPON = {
  code: 'WELCOME20',
  discount: 20, // percentage
  popup: true,
} as const;

