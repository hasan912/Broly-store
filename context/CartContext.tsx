'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/lib/types';
import * as cartUtils from '@/lib/cart';

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, quantity: number, price: number, selectedSize?: string) => void;
  removeFromCart: (productId: string, selectedSize?: string) => void;
  updateCartItem: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setItems(cartUtils.getCart());
    setMounted(true);
  }, []);

  const handleAddToCart = (productId: string, quantity: number, price: number, selectedSize?: string) => {
    const updatedCart = cartUtils.addToCart(productId, quantity, price, selectedSize);
    setItems(updatedCart);
  };

  const handleRemoveFromCart = (productId: string, selectedSize?: string) => {
    const updatedCart = cartUtils.removeFromCart(productId, selectedSize);
    setItems(updatedCart);
  };

  const handleUpdateCartItem = (productId: string, quantity: number, selectedSize?: string) => {
    const updatedCart = cartUtils.updateCartItem(productId, quantity, selectedSize);
    setItems(updatedCart);
  };

  const handleClearCart = () => {
    cartUtils.clearCart();
    setItems([]);
  };

  const total = cartUtils.getCartTotal(items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart: handleAddToCart,
        removeFromCart: handleRemoveFromCart,
        updateCartItem: handleUpdateCartItem,
        clearCart: handleClearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  
  // Return default value during SSR/static generation when CartProvider doesn't exist
  if (context === undefined) {
    return {
      items: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateCartItem: () => {},
      clearCart: () => {},
      total: 0,
      itemCount: 0,
    };
  }
  
  return context;
}
