import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as cartService from '../_services/cart';
import { useAuth } from './AuthContext';

const emptyCart = { items: [], count: 0, total: 0 };

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setCart(emptyCart);
      return;
    }
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart({
        items: data.items || [],
        count: data.count || 0,
        total: data.total || 0,
      });
    } catch {
      setCart(emptyCart);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (bookId, qty = 1) => {
      await cartService.addToCart(bookId, qty);
      await refresh();
    },
    [refresh]
  );

  const updateQty = useCallback(
    async (id, qty) => {
      await cartService.updateCartItem(id, qty);
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (id) => {
      await cartService.removeCartItem(id);
      await refresh();
    },
    [refresh]
  );

  const clear = useCallback(async () => {
    await cartService.clearCart();
    await refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ cart, loading, refresh, add, updateQty, remove, clear }),
    [cart, loading, refresh, add, updateQty, remove, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart harus dipakai di dalam CartProvider');
  }
  return context;
}
