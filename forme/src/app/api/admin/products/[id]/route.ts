import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { supabase } = await requireAdmin();

    const { data: product, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug), product_images(*), product_variants(*)')
      .eq('id', id)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: error?.message || 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { supabase } = await requireAdmin();
    const body = await req.json();

    const {
      name,
      description,
      categoryId,
      basePricePaisa,
      salePricePaisa,
      sku,
      imageUrl,
      isActive,
      isFeatured,
    } = body;

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description?.trim() || null;
    if (categoryId !== undefined) updates.category_id = categoryId;
    if (basePricePaisa !== undefined) updates.base_price_paisa = Math.round(basePricePaisa);
    if (salePricePaisa !== undefined) {
      updates.sale_price_paisa = salePricePaisa ? Math.round(salePricePaisa) : null;
    }
    if (sku !== undefined) updates.sku = sku?.trim() || null;
    if (isActive !== undefined) updates.is_active = Boolean(isActive);
    if (isFeatured !== undefined) updates.is_featured = Boolean(isFeatured);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: product, error: updateErr } = await (supabase.from('products') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 400 });
    }

    // Update primary image if provided
    if (imageUrl) {
      const { data: existingImg } = await supabase
        .from('product_images')
        .select('id')
        .eq('product_id', id)
        .eq('is_primary', true)
        .maybeSingle();

      if (existingImg) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('product_images') as any)
          .update({ url: imageUrl.trim() })
          .eq('id', existingImg.id);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('product_images') as any).insert({
          product_id: id,
          url: imageUrl.trim(),
          alt: product.name,
          is_primary: true,
          sort_order: 1,
        });
      }
    }

    return NextResponse.json({ success: true, product });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { supabase } = await requireAdmin();

    // Check query params for soft delete vs hard delete
    const url = new URL(req.url);
    const soft = url.searchParams.get('soft') !== 'false';

    if (soft) {
      // Soft delete: set is_active = false
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('products') as any)
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: 'Product deactivated (soft deleted).' });
    } else {
      // Hard delete: remove images and variants first to respect foreign keys
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('product_images') as any).delete().eq('product_id', id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('product_variants') as any).delete().eq('product_id', id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('products') as any).delete().eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: 'Product permanently deleted.' });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
