'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  orderId: string;
  initialStatus: string;
}

const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' },
];

export default function OrderStatusUpdater({ orderId, initialStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function handleStatusChange(newStatus: string) {
    setStatus(newStatus);
    setLoading(true);
    setMsg('');

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      setMsg('Status updated');
      setTimeout(() => setMsg(''), 3000);
      router.refresh();
    } catch {
      setMsg('Update failed');
      setStatus(initialStatus);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <label htmlFor="order-status-select" style={{ fontSize: 13, fontWeight: 600, color: '#4B5563' }}>
        Status:
      </label>
      <select
        id="order-status-select"
        value={status}
        disabled={loading}
        onChange={(e) => handleStatusChange(e.target.value)}
        style={{
          background: '#FFFFFF',
          color: '#1F2937',
          border: '1.5px solid #E5E7EB',
          padding: '8px 14px',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {msg && (
        <span style={{ fontSize: 12, fontWeight: 600, color: msg.includes('failed') ? '#DC2626' : '#16A34A' }}>
          {msg}
        </span>
      )}
    </div>
  );
}
