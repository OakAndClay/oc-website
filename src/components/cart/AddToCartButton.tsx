'use client';

import { useState } from 'react';
import { addToGuestCart } from '@/lib/cart-store';

interface Props {
  productId: string;
  label?: string;
  authenticated?: boolean;
}

export default function AddToCartButton({ productId, label = 'Add to Cart', authenticated }: Props) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAdd() {
    setLoading(true);
    try {
      if (authenticated) {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity: 1 }),
        });
      } else {
        addToGuestCart(productId, 1);
      }
      window.dispatchEvent(new Event('cart-update'));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="bg-stone-800 text-white font-roboto font-medium px-6 py-3 rounded hover:bg-stone-700 transition-colors disabled:opacity-50"
    >
      {loading ? 'Adding...' : added ? '✓ Added!' : label}
    </button>
  );
}
