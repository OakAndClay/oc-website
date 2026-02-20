'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductPage from '@/components/ProductPage';

interface Order {
  id: string;
  status: string;
  paymentMethod: string;
  subtotal: number;
  cryptoFee: number;
  total: number;
  depositAmount: number | null;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    total: number;
    product: { name: string; type: string };
  }[];
}

const statusLabels: Record<string, string> = {
  pending: 'Pending Payment',
  deposit_paid: 'Deposit Paid — Awaiting Balance',
  balance_paid: 'Fully Paid — Awaiting Fabrication',
  fabrication_scheduled: 'Fabrication Scheduled',
  shipped: 'Shipped',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center mt-12"><p className="font-roboto text-stone-600">Loading order...</p></div>}>
      <OrderDetailContent />
    </Suspense>
  );
}

function OrderDetailContent() {
  const { orderId } = useParams<{ orderId: string }>();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [payingBalance, setPayingBalance] = useState(false);

  const isCrypto = searchParams.get('crypto');
  const cryptoAddress = searchParams.get('address');
  const cryptoAmount = searchParams.get('amount');
  const cryptoCurrency = searchParams.get('currency');
  const success = searchParams.get('success');
  const balancePaid = searchParams.get('balance_paid');

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setOrder(null);
        else setOrder(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  async function handlePayBalance() {
    setPayingBalance(true);
    try {
      const res = await fetch('/api/checkout/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setPayingBalance(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-12">
        <p className="font-roboto text-stone-600">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center mt-12 px-4 w-full">
        <ProductPage>
          <h2 className="font-cinzel text-3xl text-center">Order Not Found</h2>
        </ProductPage>
      </div>
    );
  }

  const hasKit = order.items.some((i) => i.product.type === 'kit');
  const balanceDue = order.depositAmount ? order.total - order.depositAmount : 0;

  return (
    <div className="flex flex-col items-center mt-12 px-4 w-full">
      <ProductPage className="mb-20">
        <h2 className="font-cinzel text-3xl mb-2">Order Details</h2>
        <p className="font-roboto text-stone-500 text-sm mb-6">
          Order {order.id.slice(0, 8)}... · {new Date(order.createdAt).toLocaleDateString()}
        </p>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 font-roboto text-sm">
            Payment successful! Thank you for your order.
          </div>
        )}

        {balancePaid && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 font-roboto text-sm">
            Balance paid! Your order will proceed to fabrication.
          </div>
        )}

        {isCrypto && cryptoAddress && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-4 rounded mb-4 font-roboto text-sm">
            <p className="font-medium mb-2">Send crypto payment to complete your order:</p>
            <p><strong>Amount:</strong> {cryptoAmount} {cryptoCurrency?.toUpperCase()}</p>
            <p className="break-all"><strong>Address:</strong> {cryptoAddress}</p>
            <p className="mt-2 text-xs text-blue-600">Payment will be confirmed automatically once the transaction is verified.</p>
          </div>
        )}

        {/* Status */}
        <div className="mb-6 p-4 bg-stone-50 rounded">
          <p className="font-roboto text-stone-500 text-xs uppercase tracking-wider">Status</p>
          <p className="font-cinzel text-xl text-stone-800">
            {statusLabels[order.status] || order.status}
          </p>
        </div>

        {/* Items */}
        <div className="mb-6">
          <h3 className="font-cinzel text-lg mb-3">Items</h3>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 border-b border-stone-100 font-roboto text-sm text-stone-700">
              <span>{item.product.name} ({item.product.type === 'kit' ? 'Kit' : 'Plans'}) × {item.quantity}</span>
              <span>${item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-1 mb-6">
          <div className="flex justify-between font-roboto text-stone-700 text-sm">
            <span>Subtotal</span>
            <span>${order.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          {order.cryptoFee > 0 && (
            <div className="flex justify-between font-roboto text-stone-600 text-sm">
              <span>Crypto fee</span>
              <span>${order.cryptoFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="flex justify-between font-cinzel text-lg text-stone-800 pt-2 border-t border-stone-200">
            <span>Total</span>
            <span>${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          {order.depositAmount && (
            <>
              <div className="flex justify-between font-roboto text-stone-600 text-sm">
                <span>Deposit (50%)</span>
                <span>${order.depositAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-roboto text-stone-800 font-medium text-sm">
                <span>Balance remaining</span>
                <span>${balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {order.status === 'deposit_paid' && hasKit && (
            <button
              onClick={handlePayBalance}
              disabled={payingBalance}
              className="bg-stone-800 text-white font-roboto font-medium px-6 py-3 rounded hover:bg-stone-700 transition-colors disabled:opacity-50"
            >
              {payingBalance ? 'Processing...' : `Pay Balance ($${balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2 })})`}
            </button>
          )}

          {order.status === 'completed' && order.items.some((i) => i.product.type === 'plans') && (
            <Link
              href={`/orders/${order.id}/download`}
              className="bg-stone-700 text-white font-roboto font-medium px-6 py-3 rounded hover:bg-stone-600 transition-colors"
            >
              Download Plans
            </Link>
          )}

          <Link
            href="/profile"
            className="border border-stone-300 text-stone-700 font-roboto font-medium px-6 py-3 rounded hover:bg-stone-50 transition-colors"
          >
            Back to Profile
          </Link>
        </div>
      </ProductPage>
    </div>
  );
}
