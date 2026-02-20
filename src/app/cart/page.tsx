'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductPage from '@/components/ProductPage';
import { getGuestCart, removeFromGuestCart } from '@/lib/cart-store';

interface CartItemData {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: {
    id: string;
    name: string;
    slug: string;
    type: string;
    images: string[];
  };
}

export default function CartPage() {
  const [items, setItems] = useState<CartItemData[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchCart() {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (data.authenticated) {
        setAuthenticated(true);
        setItems(data.items);
      } else {
        setAuthenticated(false);
        // For guest cart, we just show product IDs - in real app, fetch product details
        const guestCart = getGuestCart();
        // Convert guest cart to display format (limited info)
        setItems(
          guestCart.map((item) => ({
            id: item.productId,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: 0,
            subtotal: 0,
            product: {
              id: item.productId,
              name: 'Loading...',
              slug: '',
              type: '',
              images: [],
            },
          }))
        );
      }
    } catch {
      // fallback to guest cart
      const guestCart = getGuestCart();
      setItems(
        guestCart.map((item) => ({
          id: item.productId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: 0,
          subtotal: 0,
          product: { id: item.productId, name: 'Item', slug: '', type: '', images: [] },
        }))
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCart();
  }, []);

  async function handleRemove(productId: string) {
    if (authenticated) {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
    } else {
      removeFromGuestCart(productId);
    }
    fetchCart();
    window.dispatchEvent(new Event('cart-update'));
  }

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="flex flex-col items-center mt-12 px-4 w-full">
      <ProductPage className="mb-20">
        <h2 className="font-cinzel text-3xl mb-6 text-center">Your Cart</h2>

        {loading ? (
          <p className="font-roboto text-stone-600 text-center">Loading cart...</p>
        ) : items.length === 0 ? (
          <div className="text-center">
            <p className="font-roboto text-stone-600 mb-4">Your cart is empty.</p>
            <Link
              href="/kits"
              className="inline-block bg-stone-800 text-white font-roboto font-medium px-6 py-3 rounded hover:bg-stone-700 transition-colors"
            >
              Browse Kits
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b border-stone-200">
                  {item.product.images[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-cinzel text-lg text-stone-800">{item.product.name}</h3>
                    <p className="font-roboto text-stone-600 text-sm">
                      {item.product.type === 'kit' ? 'Full Kit' : 'Plans / Drawings'}
                    </p>
                    <p className="font-roboto text-stone-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    {item.subtotal > 0 && (
                      <p className="font-cinzel text-lg text-stone-800">
                        ${item.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    )}
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="font-roboto text-red-600 text-sm hover:underline mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {authenticated && total > 0 && (
              <div className="mt-6 pt-4 border-t border-stone-300">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-cinzel text-xl">Total</span>
                  <span className="font-cinzel text-2xl text-stone-800">
                    ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full text-center bg-stone-800 text-white font-roboto font-medium py-3 rounded hover:bg-stone-700 transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}

            {!authenticated && (
              <div className="mt-6 pt-4 border-t border-stone-300 text-center">
                <p className="font-roboto text-stone-600 mb-4">
                  Sign in to see prices and checkout.
                </p>
                <Link
                  href="/login"
                  className="inline-block bg-stone-800 text-white font-roboto font-medium px-6 py-3 rounded hover:bg-stone-700 transition-colors"
                >
                  Sign In to Checkout
                </Link>
              </div>
            )}
          </>
        )}
      </ProductPage>
    </div>
  );
}
