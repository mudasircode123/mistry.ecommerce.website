import { notFound } from 'next/navigation';
import { BRAND } from '@/lib/config';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/admin';
import ProductForm from '@/components/admin/ProductForm';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: `Edit Product — Admin — ${BRAND.name}` };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const { supabase } = await requireAdmin(`/admin/products/${id}/edit`);

  const { data: product, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('id', id)
    .maybeSingle();

  if (error || !product) {
    notFound();
  }

  const primaryImage = product.product_images?.find((img: { is_primary: boolean; url: string }) => img.is_primary)?.url ||
    product.product_images?.[0]?.url || '/product-clothing-1.jpg';

  const initialData = {
    id: product.id,
    name: product.name,
    description: product.description,
    categoryId: product.category_id || undefined,
    basePricePaisa: product.base_price_paisa,
    salePricePaisa: product.sale_price_paisa,
    sku: product.sku,
    imageUrl: primaryImage,
    isActive: product.is_active,
    isFeatured: product.is_featured,
  };

  return <ProductForm isEdit={true} initialData={initialData} />;
}
