'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/ToastProvider';
import { createClient } from '@/lib/supabase/client';

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  basePrice?: number;
  salePrice?: number | null;
  image?: string | null;
  category?: string;
}

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (item: WishlistItem) => Promise<void>;
  addItem: (item: WishlistItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = 'forme_wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const isInitialMount = useRef(true);
  const { toast } = useToast();

  // Load and sync with Supabase if logged in
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        // Fetch remote wishlist items
        supabase
          .from('wishlists')
          .select('id, product_id, products(id, name, slug, base_price_paisa, sale_price_paisa, product_images(url))')
          .eq('profile_id', user.id)
          .then(({ data }) => {
            if (data && data.length > 0) {
              const remoteItems: WishlistItem[] = data
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((row: any) => {
                  const p = row.products;
                  if (!p) return null;
                  return {
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    price: p.sale_price_paisa || p.base_price_paisa,
                    basePrice: p.base_price_paisa,
                    salePrice: p.sale_price_paisa,
                    image: p.product_images?.[0]?.url || null,
                  };
                })
                .filter(Boolean) as WishlistItem[];

              // Merge unique with existing items
              setItems((currentItems) => {
                const itemMap = new Map<string, WishlistItem>();
                currentItems.forEach((i) => itemMap.set(i.id, i));
                remoteItems.forEach((i) => itemMap.set(i.id, i));
                const merged = Array.from(itemMap.values());
                try {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
                } catch {}
                return merged;
              });
            }
          });
      }
    });
  }, []);

  // Save to localStorage when items change after mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const isWishlisted = useCallback(
    (productId: string) => {
      return items.some((i) => i.id === productId || i.slug === productId);
    },
    [items]
  );

  const addItem = useCallback(
    async (item: WishlistItem) => {
      setItems((prev) => {
        if (prev.some((i) => i.id === item.id)) return prev;
        return [...prev, item];
      });
      toast(`${item.name} added to wishlist`);

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user && item.id) {
          await supabase.from('wishlists').insert({
            profile_id: user.id,
            product_id: item.id,
          });
        }
      } catch {}
    },
    [toast]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      const removed = items.find((i) => i.id === productId || i.slug === productId);
      setItems((prev) => prev.filter((i) => i.id !== productId && i.slug !== productId));
      if (removed) {
        toast(`${removed.name} removed from wishlist`);
      }

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user && removed?.id) {
          await supabase
            .from('wishlists')
            .delete()
            .eq('profile_id', user.id)
            .eq('product_id', removed.id);
        }
      } catch {}
    },
    [items, toast]
  );

  const toggleWishlist = useCallback(
    async (item: WishlistItem) => {
      const exists = items.some((i) => i.id === item.id || i.slug === item.slug);
      if (exists) {
        await removeItem(item.id || item.slug);
      } else {
        await addItem(item);
      }
    },
    [items, addItem, removeItem]
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        count: items.length,
        isWishlisted,
        toggleWishlist,
        addItem,
        removeItem,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

const defaultWishlistValue: WishlistContextValue = {
  items: [],
  count: 0,
  isWishlisted: () => false,
  toggleWishlist: async () => {},
  addItem: async () => {},
  removeItem: async () => {},
  clearWishlist: () => {},
};

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  return ctx || defaultWishlistValue;
}
