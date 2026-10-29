'use client';

import React, { useState } from 'react';

interface Props {
  id: string;
  currentStatus: string;
}

export default function InquiryStatusSelect({ id, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
    new: { bg: '#DBEAFE', color: '#2563EB', border: '#BFDBFE' },
    in_progress: { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
    resolved: { bg: '#DCFCE7', color: '#16A34A', border: '#BBF7D0' },
    closed: { bg: '#F3F4F6', color: '#4B5563', border: '#E5E7EB' },
  };

  async function handleChange(newStatus: string) {
    setSaving(true);
    setStatus(newStatus);

    try {
      await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  const current = STATUS_COLORS[status] || STATUS_COLORS.new;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <select
        value={status}
        disabled={saving}
        onChange={(e) => handleChange(e.target.value)}
        style={{
          background: current.bg,
          color: current.color,
          border: `1px solid ${current.border}`,
          padding: '4px 10px',
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          outline: 'none',
          cursor: saving ? 'wait' : 'pointer',
        }}
      >
        <option value="new" style={{ background: '#FFFFFF', color: '#1F2937' }}>New</option>
        <option value="in_progress" style={{ background: '#FFFFFF', color: '#1F2937' }}>In Progress</option>
        <option value="resolved" style={{ background: '#FFFFFF', color: '#1F2937' }}>Resolved</option>
        <option value="closed" style={{ background: '#FFFFFF', color: '#1F2937' }}>Closed</option>
      </select>
    </div>
  );
}
