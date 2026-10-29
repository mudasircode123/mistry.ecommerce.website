-- ====================================================================
-- FORME E-COMMERCE PLATFORM — SUPABASE MIGRATION v003
-- Title: Database-Backed Admin Authorization & Row-Level Security (RLS)
-- Target Administrator: mudasir123456mu@gmail.com
-- Run in: Supabase Dashboard > SQL Editor
-- ====================================================================

-- 1. Helper function: verify if current authenticated session is the authorized administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_user_email TEXT;
  v_user_role TEXT;
BEGIN
  -- Unauthenticated sessions can never be admin
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Verify from auth.users and public.profiles
  SELECT LOWER(COALESCE(u.email, p.email, '')), p.role
  INTO v_user_email, v_user_role
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  WHERE u.id = auth.uid();

  -- Strictly require matching authorized email and admin role
  RETURN (
    v_user_email = 'mudasir123456mu@gmail.com'
    AND v_user_role = 'admin'
  );
END;
$$;

-- Grant execution permission
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- 2. Update handle_new_user() trigger:
--    Automatically grant 'admin' role if and only if the registering email is mudasir123456mu@gmail.com.
--    All other accounts default to 'customer'.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_role TEXT := 'customer';
BEGIN
  IF LOWER(NEW.email) = 'mudasir123456mu@gmail.com' THEN
    v_role := 'admin';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    v_role
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        role = CASE
          WHEN LOWER(EXCLUDED.email) = 'mudasir123456mu@gmail.com' THEN 'admin'
          ELSE 'customer'
        END,
        updated_at = NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Privilege Escalation Guard:
--    Prevent any user or update from setting role = 'admin' unless the account is mudasir123456mu@gmail.com.
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Prevent any non-authorized email from having role = 'admin'
  IF NEW.role = 'admin' AND LOWER(COALESCE(NEW.email, '')) <> 'mudasir123456mu@gmail.com' THEN
    NEW.role := 'customer';
  END IF;

  -- If non-admin user is attempting to update their own profile, keep the existing role
  IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
    NEW.role := OLD.role;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_role();

-- 4. Database cleanup:
--    Ensure mudasir123456mu@gmail.com has 'admin' role if account exists.
--    Demote any unauthorized account that may have been set to 'admin'.
UPDATE public.profiles
SET role = 'customer'
WHERE LOWER(email) <> 'mudasir123456mu@gmail.com' AND role = 'admin';

UPDATE public.profiles
SET role = 'admin'
WHERE LOWER(email) = 'mudasir123456mu@gmail.com';

-- 5. Row Level Security (RLS) Policies
-- ============================================

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS profiles_self_read ON public.profiles;
DROP POLICY IF EXISTS profiles_admin_read ON public.profiles;
DROP POLICY IF EXISTS profiles_self_update ON public.profiles;
DROP POLICY IF EXISTS profiles_admin_all ON public.profiles;

CREATE POLICY profiles_self_read ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY profiles_self_update ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- PRODUCTS (Public can only view active products; authorized admin has full CRUD)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS products_public_read ON public.products;
DROP POLICY IF EXISTS products_admin_all ON public.products;

CREATE POLICY products_public_read ON public.products
  FOR SELECT USING (is_active = TRUE OR public.is_admin());

CREATE POLICY products_admin_all ON public.products
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- PRODUCT VARIANTS (Public read; authorized admin full CRUD)
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS variants_public_read ON public.product_variants;
DROP POLICY IF EXISTS variants_admin_all ON public.product_variants;

CREATE POLICY variants_public_read ON public.product_variants
  FOR SELECT USING (TRUE);

CREATE POLICY variants_admin_all ON public.product_variants
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- PRODUCT IMAGES (Public read; authorized admin full CRUD)
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS images_public_read ON public.product_images;
DROP POLICY IF EXISTS images_admin_all ON public.product_images;

CREATE POLICY images_public_read ON public.product_images
  FOR SELECT USING (TRUE);

CREATE POLICY images_admin_all ON public.product_images
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- CATEGORIES (Public read active; authorized admin full CRUD)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS categories_public_read ON public.categories;
DROP POLICY IF EXISTS categories_admin_all ON public.categories;

CREATE POLICY categories_public_read ON public.categories
  FOR SELECT USING (is_active = TRUE OR public.is_admin());

CREATE POLICY categories_admin_all ON public.categories
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ORDERS (Customers read own; authorized admin can view and update all)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS orders_customer_read ON public.orders;
DROP POLICY IF EXISTS orders_create ON public.orders;
DROP POLICY IF EXISTS orders_admin_all ON public.orders;

CREATE POLICY orders_customer_read ON public.orders
  FOR SELECT USING ((auth.uid() IS NOT NULL AND auth.uid() = profile_id) OR public.is_admin());

CREATE POLICY orders_create ON public.orders
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY orders_admin_all ON public.orders
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ORDER ITEMS (Customers read own items; authorized admin can view/manage all)
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS order_items_customer_read ON public.order_items;
DROP POLICY IF EXISTS order_items_admin_all ON public.order_items;

CREATE POLICY order_items_customer_read ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.profile_id = auth.uid()
    ) OR public.is_admin()
  );

CREATE POLICY order_items_admin_all ON public.order_items
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- SUPPLIERS (Admin only)
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS suppliers_admin_all ON public.suppliers;
CREATE POLICY suppliers_admin_all ON public.suppliers
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- AUDIT LOGS (Admin only)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS audit_logs_admin_all ON public.audit_logs;
CREATE POLICY audit_logs_admin_all ON public.audit_logs
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- COUPONS (Public reads active coupons; admin manages)
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS coupons_read ON public.coupons;
DROP POLICY IF EXISTS coupons_admin_all ON public.coupons;

CREATE POLICY coupons_read ON public.coupons
  FOR SELECT USING (is_active = TRUE OR public.is_admin());

CREATE POLICY coupons_admin_all ON public.coupons
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- INQUIRIES (Users submit & view own; admin views and manages all)
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS inquiries_create ON public.inquiries;
DROP POLICY IF EXISTS inquiries_read ON public.inquiries;
DROP POLICY IF EXISTS inquiries_admin_all ON public.inquiries;

CREATE POLICY inquiries_create ON public.inquiries
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY inquiries_read ON public.inquiries
  FOR SELECT USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR public.is_admin()
  );

CREATE POLICY inquiries_admin_all ON public.inquiries
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());
