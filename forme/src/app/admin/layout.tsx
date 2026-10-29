import React from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import AdminShell from '@/components/admin/AdminShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side guard: validates authentication and authorization before rendering any admin subroute
  await requireAdmin('/admin');

  return <AdminShell>{children}</AdminShell>;
}
