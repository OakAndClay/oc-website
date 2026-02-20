'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getGuestCartCount } from '@/lib/cart-store';

export default function CartIcon({ authenticated }: { authenticated?: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchCount() {
      if (authenticated) {
        try {
          const res = await fetch('/api/cart');
          const data = await res.json();
          setCount(data.items?.length ?? 0);
        } catch {
          setCount(0);
        }
      } else {
        setCount(getGuestCartCount());
      }
    }

    fetchCount();

    const handler = () => fetchCount();
    window.addEventListener('cart-update', handler);
    return () => window.removeEventListener('cart-update', handler);
  }, [authenticated]);

  return (
    <Link href="/cart" className="relative p-2 text-stone-700 hover:text-stone-900 transition-colors">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-stone-800 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
