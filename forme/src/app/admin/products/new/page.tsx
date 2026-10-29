import { BRAND } from '@/lib/config';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/admin';
import ProductForm from '@/components/admin/ProductForm';

export const metadata: Metadata = { title: `Add Product — Admin — ${BRAND.name}` };

export default async function NewProductPage() {
  await requireAdmin('/admin/products/new');

  return <ProductForm isEdit={false} />;
}
