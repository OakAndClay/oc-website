'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductPage from '@/components/ProductPage';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      // Merge guest cart
      const guestCart = localStorage.getItem('oc-guest-cart');
      if (guestCart) {
        try {
          await fetch('/api/cart/merge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: JSON.parse(guestCart) }),
          });
          localStorage.removeItem('oc-guest-cart');
        } catch { /* ignore merge errors */ }
      }
      router.push('/profile');
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col items-center mt-12 px-4 w-full">
      <ProductPage className="mb-20">
        <h2 className="font-cinzel text-3xl mb-6 text-center">Sign In</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 font-roboto text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-roboto text-stone-700 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500 font-roboto"
            />
          </div>
          <div>
            <label className="block font-roboto text-stone-700 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500 font-roboto"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-800 text-white font-roboto font-medium py-3 rounded hover:bg-stone-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/70 text-stone-500 font-roboto">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => signIn('google', { callbackUrl: '/profile' })}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-stone-300 rounded hover:bg-stone-50 transition-colors font-roboto text-sm"
            >
              Google
            </button>
            <button
              onClick={() => signIn('apple', { callbackUrl: '/profile' })}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-stone-300 rounded hover:bg-stone-50 transition-colors font-roboto text-sm"
            >
              Apple
            </button>
          </div>
        </div>

        <p className="mt-6 text-center font-roboto text-stone-600 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-stone-800 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </ProductPage>
    </div>
  );
}
