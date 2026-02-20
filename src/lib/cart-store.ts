'use client';

// Guest cart using localStorage
export interface GuestCartItem {
  productId: string;
  quantity: number;
}

const CART_KEY = 'oc-guest-cart';

export function getGuestCart(): GuestCartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

export function setGuestCart(items: GuestCartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cart-update'));
}

export function addToGuestCart(productId: string, quantity = 1) {
  const cart = getGuestCart();
  const existing = cart.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  setGuestCart(cart);
}

export function removeFromGuestCart(productId: string) {
  const cart = getGuestCart().filter((i) => i.productId !== productId);
  setGuestCart(cart);
}

export function clearGuestCart() {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event('cart-update'));
}

export function getGuestCartCount(): number {
  return getGuestCart().reduce((sum, i) => sum + i.quantity, 0);
}
