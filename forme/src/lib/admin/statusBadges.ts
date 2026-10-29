// Shared status badge config for admin pages
// Single source of truth — import from here, not inline in each page

export interface BadgeConfig {
  bg: string;
  text: string;
  label: string;
}

export const ORDER_STATUS_BADGES: Record<string, BadgeConfig> = {
  pending:          { bg: '#FEF3C7', text: '#D97706', label: 'Pending' },
  confirmed:        { bg: '#DBEAFE', text: '#2563EB', label: 'Confirmed' },
  processing:       { bg: '#EDE9FE', text: '#7C3AED', label: 'Processing' },
  shipped:          { bg: '#CFFAFE', text: '#0891B2', label: 'Shipped' },
  out_for_delivery: { bg: '#D1FAE5', text: '#059669', label: 'Out for Delivery' },
  delivered:        { bg: '#DCFCE7', text: '#16A34A', label: 'Delivered' },
  cancelled:        { bg: '#FEE2E2', text: '#DC2626', label: 'Cancelled' },
  returned:         { bg: '#F3F4F6', text: '#4B5563', label: 'Returned' },
};

export const PAYMENT_STATUS_BADGES: Record<string, BadgeConfig> = {
  paid:     { bg: '#DCFCE7', text: '#16A34A', label: 'Paid' },
  pending:  { bg: '#FEF3C7', text: '#D97706', label: 'Pending' },
  failed:   { bg: '#FEE2E2', text: '#DC2626', label: 'Failed' },
  refunded: { bg: '#EDE9FE', text: '#7C3AED', label: 'Refunded' },
};

/** Returns config for a status key, falling back to a neutral badge. */
export function getOrderBadge(status: string): BadgeConfig {
  return ORDER_STATUS_BADGES[status] ?? { bg: '#F3F4F6', text: '#4B5563', label: status };
}

export function getPaymentBadge(status: string): BadgeConfig {
  return PAYMENT_STATUS_BADGES[status] ?? { bg: '#F3F4F6', text: '#4B5563', label: status };
}

