'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductPage from '@/components/ProductPage';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!acceptTerms) {
      setError('You must accept the Terms of Use');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, acceptTerms }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      // Auto sign-in after signup
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Account created but sign-in failed. Please sign in manually.');
        setLoading(false);
      } else {
        router.push('/profile');
        router.refresh();
      }
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center mt-12 px-4 w-full">
      <ProductPage className="mb-20">
        <h2 className="font-cinzel text-3xl mb-6 text-center">Create Account</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 font-roboto text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-roboto text-stone-700 text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500 font-roboto"
            />
          </div>
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
              minLength={8}
              className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500 font-roboto"
            />
          </div>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="terms" className="font-roboto text-stone-700 text-sm">
              I accept the{' '}
              <Link href="/terms" className="text-stone-800 font-medium hover:underline" target="_blank">
                Terms of Use
              </Link>
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-800 text-white font-roboto font-medium py-3 rounded hover:bg-stone-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center font-roboto text-stone-600 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-stone-800 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </ProductPage>
    </div>
  );
}
