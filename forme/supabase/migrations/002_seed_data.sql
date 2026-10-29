-- ============================================
-- FORME E-COMMERCE — SEED DATA v001
-- Run AFTER 001_initial_schema.sql
-- Provides demo categories, products, and welcome coupon
-- ============================================

-- Categories
INSERT INTO public.categories (id, name, slug, description, sort_order, is_active)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Clothing',    'clothing',    'Premium hoodies, t-shirts, blazers, and trousers', 1, TRUE),
  ('a1000000-0000-0000-0000-000000000002', 'Sneakers',    'sneakers',    'Premium sneakers and footwear',                  2, TRUE),
  ('a1000000-0000-0000-0000-000000000003', 'Accessories', 'accessories', 'Complete your look with FORME accessories',       3, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Demo Products
INSERT INTO public.products (id, name, slug, description, category_id, sku, base_price_paisa, sale_price_paisa, is_active, is_featured, sourcing_type, tags)
VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'Oversized Premium Hoodie',
    'oversized-premium-hoodie',
    'Crafted from 380gsm heavyweight fleece cotton, our Oversized Premium Hoodie is designed for effortless comfort and elevated street style. Features a relaxed silhouette, kangaroo pocket, and ribbed cuffs. Machine washable.',
    'a1000000-0000-0000-0000-000000000001',
    'FRM-HOD-001',
    549900, NULL, TRUE, TRUE, 'own_stock',
    ARRAY['clothing', 'hoodie', 'new-arrivals']
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'Minimal White Leather Sneaker',
    'minimal-white-leather-sneaker',
    'Premium full-grain leather upper with an ultra-clean minimal design. Cushioned leather insole and vulcanised rubber sole for lasting comfort.',
    'a1000000-0000-0000-0000-000000000002',
    'FRM-SNK-001',
    899900, 749900, TRUE, TRUE, 'own_stock',
    ARRAY['sneakers', 'sale']
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'Camel Wool-Blend Blazer',
    'camel-wool-blend-blazer',
    'A sophisticated double-breasted blazer in a warm camel tone. Made from a premium wool-blend fabric with a structured silhouette and notched lapel.',
    'a1000000-0000-0000-0000-000000000001',
    'FRM-BLZ-001',
    1249900, NULL, TRUE, FALSE, 'own_stock',
    ARRAY['clothing', 'blazer', 'new-arrivals']
  ),
  (
    'b1000000-0000-0000-0000-000000000004',
    'High-Top Urban Boot',
    'high-top-urban-boot',
    'A bold high-top silhouette designed for urban exploration. Premium materials, cushioned insole, and a durable rubber sole.',
    'a1000000-0000-0000-0000-000000000002',
    'FRM-BOT-001',
    1099900, 899900, TRUE, FALSE, 'own_stock',
    ARRAY['sneakers', 'sale']
  ),
  (
    'b1000000-0000-0000-0000-000000000005',
    'Essential Premium White Tee',
    'essential-premium-white-tee',
    'The perfect white tee. 230gsm supima cotton with a relaxed fit. Pre-shrunk and colour-fast.',
    'a1000000-0000-0000-0000-000000000001',
    'FRM-TEE-001',
    249900, NULL, TRUE, FALSE, 'own_stock',
    ARRAY['clothing', 'tshirt', 'new-arrivals']
  ),
  (
    'b1000000-0000-0000-0000-000000000006',
    'Chunky Runner Sneaker',
    'chunky-runner-sneaker',
    'Maximum cushioning meets bold streetwear design. Chunky sole, breathable mesh upper, and striking colourway.',
    'a1000000-0000-0000-0000-000000000002',
    'FRM-RUN-001',
    1299900, 999900, TRUE, TRUE, 'own_stock',
    ARRAY['sneakers', 'sale']
  ),
  (
    'b1000000-0000-0000-0000-000000000007',
    'Tailored Cargo Trousers',
    'tailored-cargo-trousers',
    'Elevated cargo trousers with a tailored silhouette. Multiple pockets, adjustable waist, and durable ripstop fabric.',
    'a1000000-0000-0000-0000-000000000001',
    'FRM-CGO-001',
    649900, NULL, TRUE, FALSE, 'own_stock',
    ARRAY['clothing', 'trousers', 'new-arrivals']
  ),
  (
    'b1000000-0000-0000-0000-000000000008',
    'Heritage Low-Top Sneaker',
    'heritage-low-top-sneaker',
    'A timeless low-top silhouette inspired by classic court shoes. Premium suede upper and cupsole construction.',
    'a1000000-0000-0000-0000-000000000002',
    'FRM-LT-001',
    799900, NULL, TRUE, FALSE, 'own_stock',
    ARRAY['sneakers']
  )
ON CONFLICT (slug) DO NOTHING;

-- Product variants for Oversized Hoodie
INSERT INTO public.product_variants (product_id, size, color, color_hex, sku, stock_quantity, is_available)
VALUES
  ('b1000000-0000-0000-0000-000000000001', 'XS', 'Jet Black', '#171717', 'FRM-HOD-001-XS-BLK', 5, TRUE),
  ('b1000000-0000-0000-0000-000000000001', 'S',  'Jet Black', '#171717', 'FRM-HOD-001-S-BLK',  12, TRUE),
  ('b1000000-0000-0000-0000-000000000001', 'M',  'Jet Black', '#171717', 'FRM-HOD-001-M-BLK',  8, TRUE),
  ('b1000000-0000-0000-0000-000000000001', 'L',  'Jet Black', '#171717', 'FRM-HOD-001-L-BLK',  3, TRUE),
  ('b1000000-0000-0000-0000-000000000001', 'XL', 'Jet Black', '#171717', 'FRM-HOD-001-XL-BLK', 0, FALSE),
  ('b1000000-0000-0000-0000-000000000001', 'S',  'Stone Grey', '#9ca3af', 'FRM-HOD-001-S-GRY', 7, TRUE),
  ('b1000000-0000-0000-0000-000000000001', 'M',  'Stone Grey', '#9ca3af', 'FRM-HOD-001-M-GRY', 9, TRUE),
  ('b1000000-0000-0000-0000-000000000001', 'L',  'Stone Grey', '#9ca3af', 'FRM-HOD-001-L-GRY', 4, TRUE)
ON CONFLICT DO NOTHING;

-- Variants for White Sneaker
INSERT INTO public.product_variants (product_id, size, color, color_hex, sku, stock_quantity, is_available)
VALUES
  ('b1000000-0000-0000-0000-000000000002', '39', 'White', '#FFFFFF', 'FRM-SNK-001-39', 4, TRUE),
  ('b1000000-0000-0000-0000-000000000002', '40', 'White', '#FFFFFF', 'FRM-SNK-001-40', 6, TRUE),
  ('b1000000-0000-0000-0000-000000000002', '41', 'White', '#FFFFFF', 'FRM-SNK-001-41', 8, TRUE),
  ('b1000000-0000-0000-0000-000000000002', '42', 'White', '#FFFFFF', 'FRM-SNK-001-42', 5, TRUE),
  ('b1000000-0000-0000-0000-000000000002', '43', 'White', '#FFFFFF', 'FRM-SNK-001-43', 2, TRUE),
  ('b1000000-0000-0000-0000-000000000002', '44', 'White', '#FFFFFF', 'FRM-SNK-001-44', 0, FALSE),
  ('b1000000-0000-0000-0000-000000000002', '45', 'White', '#FFFFFF', 'FRM-SNK-001-45', 1, TRUE)
ON CONFLICT DO NOTHING;

-- Variants for Blazer
INSERT INTO public.product_variants (product_id, size, color, color_hex, sku, stock_quantity, is_available)
VALUES
  ('b1000000-0000-0000-0000-000000000003', 'XS', 'Camel', '#C19A6B', 'FRM-BLZ-001-XS', 2, TRUE),
  ('b1000000-0000-0000-0000-000000000003', 'S',  'Camel', '#C19A6B', 'FRM-BLZ-001-S',  5, TRUE),
  ('b1000000-0000-0000-0000-000000000003', 'M',  'Camel', '#C19A6B', 'FRM-BLZ-001-M',  7, TRUE),
  ('b1000000-0000-0000-0000-000000000003', 'L',  'Camel', '#C19A6B', 'FRM-BLZ-001-L',  4, TRUE),
  ('b1000000-0000-0000-0000-000000000003', 'XL', 'Camel', '#C19A6B', 'FRM-BLZ-001-XL', 1, TRUE)
ON CONFLICT DO NOTHING;

-- Welcome coupon (WELCOME10)
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order_paisa, max_uses, is_active)
VALUES (
  'WELCOME10',
  '10% off your first order — Welcome discount',
  'percentage',
  10,
  0,
  NULL, -- unlimited
  TRUE
)
ON CONFLICT (code) DO NOTHING;

-- Product images (reference public/ folder paths)
INSERT INTO public.product_images (product_id, url, alt, sort_order, is_primary)
VALUES
  ('b1000000-0000-0000-0000-000000000001', '/product-clothing-1.jpg', 'Oversized Premium Hoodie', 0, TRUE),
  ('b1000000-0000-0000-0000-000000000002', '/product-sneaker-1.jpg',  'Minimal White Leather Sneaker', 0, TRUE),
  ('b1000000-0000-0000-0000-000000000003', '/product-jacket-1.jpg',   'Camel Wool-Blend Blazer', 0, TRUE),
  ('b1000000-0000-0000-0000-000000000004', '/product-sneaker-2.jpg',  'High-Top Urban Boot', 0, TRUE),
  ('b1000000-0000-0000-0000-000000000005', '/product-tshirt-1.jpg',   'Essential Premium White Tee', 0, TRUE),
  ('b1000000-0000-0000-0000-000000000006', '/product-sneaker-1.jpg',  'Chunky Runner Sneaker', 0, TRUE),
  ('b1000000-0000-0000-0000-000000000007', '/product-clothing-1.jpg', 'Tailored Cargo Trousers', 0, TRUE),
  ('b1000000-0000-0000-0000-000000000008', '/product-sneaker-2.jpg',  'Heritage Low-Top Sneaker', 0, TRUE)
ON CONFLICT DO NOTHING;
