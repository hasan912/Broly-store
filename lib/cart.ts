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

function getCartItemKey(productId: string, selectedSize?: string): string {
  return selectedSize ? `${productId}-${selectedSize}` : productId;
}

export function addToCart(productId: string, quantity: number, price: number, selectedSize?: string): CartItem[] {
  const cart = getCart();
  const itemKey = getCartItemKey(productId, selectedSize);
  const existingItem = cart.find((item) => getCartItemKey(item.productId, item.selectedSize) === itemKey);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity, price, selectedSize });
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: string, selectedSize?: string): CartItem[] {
  const itemKey = getCartItemKey(productId, selectedSize);
  const cart = getCart().filter((item) => getCartItemKey(item.productId, item.selectedSize) !== itemKey);
  saveCart(cart);
  return cart;
}

export function updateCartItem(productId: string, quantity: number, selectedSize?: string): CartItem[] {
  const cart = getCart();
  const itemKey = getCartItemKey(productId, selectedSize);
  const item = cart.find((item) => getCartItemKey(item.productId, item.selectedSize) === itemKey);

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId, selectedSize);
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
