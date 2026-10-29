import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  try {
    const { supabase } = await requireAdmin();
    const { data: products, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug), product_images(*)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ products });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { supabase } = await requireAdmin();
    const body = await req.json();

    const {
      name,
      description = '',
      categoryId,
      basePricePaisa,
      salePricePaisa = null,
      sku = '',
      imageUrl = '/product-clothing-1.jpg',
      sizes = ['S', 'M', 'L', 'XL'],
      isActive = true,
      isFeatured = false,
      sourcingType = 'own_stock',
    } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });
    }

    if (!basePricePaisa || basePricePaisa <= 0) {
      return NextResponse.json({ error: 'Valid base price is required.' }, { status: 400 });
    }

    const baseSlug = slugify(name);
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

    // 1. Insert product
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: product, error: prodErr } = await (supabase.from('products') as any)
      .insert({
        name: name.trim(),
        slug: uniqueSlug,
        description: description?.trim() || null,
        category_id: categoryId || 'a0000000-0000-0000-0000-000000000001',
        sku: sku?.trim() || `FRM-${Date.now().toString(36).toUpperCase()}`,
        base_price_paisa: Math.round(basePricePaisa),
        sale_price_paisa: salePricePaisa ? Math.round(salePricePaisa) : null,
        is_active: Boolean(isActive),
        is_featured: Boolean(isFeatured),
        sourcing_type: sourcingType,
        tags: [name.toLowerCase().trim()],
        supplier_id: null,
        size_guide: null,
      })
      .select()
      .single();

    if (prodErr || !product) {
      return NextResponse.json({ error: prodErr?.message || 'Failed to create product' }, { status: 400 });
    }

    // 2. Insert product image
    if (imageUrl) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('product_images') as any).insert({
        product_id: product.id,
        url: imageUrl.trim(),
        alt: product.name,
        is_primary: true,
        sort_order: 1,
      });
    }

    // 3. Insert default variants for sizes
    if (Array.isArray(sizes) && sizes.length > 0) {
      const variants = sizes.map((s: string) => ({
        product_id: product.id,
        size: s,
        color: 'Default',
        color_hex: '#171717',
        sku: null,
        price_paisa: null,
        stock_quantity: 10,
        is_available: true,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('product_variants') as any).insert(variants);
    }

    return NextResponse.json({ success: true, product });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
