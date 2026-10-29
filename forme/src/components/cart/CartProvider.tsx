'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import type { Cart, CartItem } from '@/types/database';

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QTY'; id: string; quantity: number }
  | { type: 'APPLY_COUPON'; code: string; discountPaisa: number }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CLEAR' }
  | { type: 'LOAD'; cart: Cart };

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Check if same variant already in cart
      const existing = state.items.find(
        (i) => i.productId === action.item.productId && i.variantId === action.item.variantId
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === existing.id
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: Math.max(1, action.quantity) } : i
        ),
      };
    case 'APPLY_COUPON':
      return { ...state, couponCode: action.code, couponDiscount: action.discountPaisa };
    case 'REMOVE_COUPON':
      return { ...state, couponCode: null, couponDiscount: 0 };
    case 'CLEAR':
      return { items: [], couponCode: null, couponDiscount: 0 };
    case 'LOAD':
      return action.cart;
    default:
      return state;
  }
}

const initialCart: Cart = { items: [], couponCode: null, couponDiscount: 0 };

interface CartContextValue {
  cart: Cart;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, quantity: number) => void;
  applyCoupon: (code: string, discountPaisa: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  subtotalPaisa: number;
  itemCount: number;
  // Convenience aliases
  items: CartItem[];
  subtotal: number;
  couponDiscount: number;
  couponCode: string | null;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  const [isOpen, setIsOpen] = React.useState(false);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('forme_cart');
      if (stored) dispatch({ type: 'LOAD', cart: JSON.parse(stored) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('forme_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const subtotalPaisa = cart.items.reduce(
    (sum, i) => sum + i.unitPricePaisa * i.quantity,
    0
  );
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  const value: CartContextValue = {
    cart,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
    removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', id }),
    updateQty: (id, quantity) => dispatch({ type: 'UPDATE_QTY', id, quantity }),
    applyCoupon: (code, discountPaisa) =>
      dispatch({ type: 'APPLY_COUPON', code, discountPaisa }),
    removeCoupon: () => dispatch({ type: 'REMOVE_COUPON' }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
    subtotalPaisa,
    itemCount,
    // Convenience aliases
    items: cart.items,
    subtotal: subtotalPaisa,
    couponDiscount: cart.couponDiscount,
    couponCode: cart.couponCode,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

const defaultCartValue: CartContextValue = {
  cart: initialCart,
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  addItem: () => {},
  removeItem: () => {},
  updateQty: () => {},
  applyCoupon: () => {},
  removeCoupon: () => {},
  clearCart: () => {},
  subtotalPaisa: 0,
  itemCount: 0,
  items: [],
  subtotal: 0,
  couponDiscount: 0,
  couponCode: null,
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  return ctx || defaultCartValue;
}
