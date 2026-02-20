'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AuthButtons() {
  const [session, setSession] = useState<{ user?: { name?: string } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((data) => {
        setSession(data?.user ? data : null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (session?.user) {
    return (
      <Link
        href="/profile"
        className="font-roboto text-stone-700 hover:text-stone-900 font-medium transition-colors"
      >
        {session.user.name || 'Profile'}
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="font-roboto text-stone-700 hover:text-stone-900 font-medium transition-colors"
    >
      Sign In
    </Link>
  );
}
