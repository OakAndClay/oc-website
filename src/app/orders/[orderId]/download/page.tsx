'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductPage from '@/components/ProductPage';

interface Order {
  id: string;
  status: string;
  items: {
    id: string;
    product: { name: string; type: string };
  }[];
}

export default function DownloadPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data.error ? null : data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-12">
        <p className="font-roboto text-stone-600">Loading...</p>
      </div>
    );
  }

  const canDownload = order && (order.status === 'completed' || order.status === 'deposit_paid' || order.status === 'balance_paid');
  const planItems = order?.items.filter((i) => i.product.type === 'plans') ?? [];

  return (
    <div className="flex flex-col items-center mt-12 px-4 w-full">
      <ProductPage className="mb-20">
        <h2 className="font-cinzel text-3xl mb-6 text-center">Download Plans</h2>

        {!order ? (
          <p className="font-roboto text-stone-600 text-center">Order not found.</p>
        ) : !canDownload ? (
          <div className="text-center">
            <p className="font-roboto text-stone-600 mb-4">
              Payment must be completed before downloading plans.
            </p>
            <Link
              href={`/orders/${orderId}`}
              className="inline-block bg-stone-800 text-white font-roboto font-medium px-6 py-3 rounded hover:bg-stone-700 transition-colors"
            >
              View Order
            </Link>
          </div>
        ) : planItems.length === 0 ? (
          <p className="font-roboto text-stone-600 text-center">No downloadable plans in this order.</p>
        ) : (
          <div className="space-y-4">
            {planItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-stone-200 rounded">
                <div>
                  <h3 className="font-cinzel text-lg text-stone-800">{item.product.name}</h3>
                  <p className="font-roboto text-stone-500 text-sm">PDF · Piece Drawings</p>
                </div>
                <button className="bg-stone-800 text-white font-roboto font-medium px-4 py-2 rounded hover:bg-stone-700 transition-colors text-sm">
                  Download PDF
                </button>
              </div>
            ))}
            <p className="font-roboto text-stone-500 text-xs text-center mt-4">
              Downloads are for personal use only. See our <Link href="/terms" className="underline">Terms of Use</Link>.
            </p>
          </div>
        )}
      </ProductPage>
    </div>
  );
}
