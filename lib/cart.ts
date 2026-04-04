import { CartItem } from './types';

const CART_KEY = 'ecommerce_cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(productId: string, quantity: number, price: number): CartItem[] {
  const cart = getCart();
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity, price });
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart().filter((item) => item.productId !== productId);
  saveCart(cart);
  return cart;
}

export function updateCartItem(productId: string, quantity: number): CartItem[] {
  const cart = getCart();
  const item = cart.find((item) => item.productId === productId);

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    item.quantity = quantity;
    saveCart(cart);
  }

  return cart;
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}
