'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductPage from '@/components/ProductPage';

interface CartItemData {
  id: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: {
    name: string;
    type: string;
  };
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center mt-12 px-4 w-full"><p className="font-roboto text-stone-600">Loading checkout...</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'crypto'>('stripe');
  const [cryptoCurrency, setCryptoCurrency] = useState('btc');
  const [error, setError] = useState('');

  const cancelled = searchParams.get('cancelled');

  useEffect(() => {
    fetch('/api/cart')
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/login');
          return;
        }
        setItems(data.items);
        setLoading(false);
      })
      .catch(() => router.push('/login'));
  }, [router]);

  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
  const hasKit = items.some((i) => i.product.type === 'kit');
  // Approximate crypto fee display (3.5% default)
  const cryptoFeePercent = 3.5;
  const cryptoFee = paymentMethod === 'crypto' ? subtotal * (cryptoFeePercent / 100) : 0;
  const total = subtotal + cryptoFee;
  const amountDue = hasKit ? total * 0.5 : total;

  async function handleCheckout() {
    setProcessing(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Checkout failed');
        setProcessing(false);
        return;
      }

      if (paymentMethod === 'stripe' && data.url) {
        window.location.href = data.url;
      } else if (paymentMethod === 'crypto') {
        // Create NOWPayments payment
        const cryptoRes = await fetch('/api/checkout/crypto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.orderId, currency: cryptoCurrency }),
        });

        const cryptoData = await cryptoRes.json();
        if (cryptoData.pay_address) {
          router.push(`/orders/${data.orderId}?crypto=true&address=${cryptoData.pay_address}&amount=${cryptoData.pay_amount}&currency=${cryptoData.pay_currency}`);
        } else {
          setError('Failed to create crypto payment');
          setProcessing(false);
        }
      }
    } catch {
      setError('An error occurred during checkout');
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-12 px-4 w-full">
        <p className="font-roboto text-stone-600">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-12 px-4 w-full">
      <ProductPage className="mb-20">
        <h2 className="font-cinzel text-3xl mb-6 text-center">Checkout</h2>

        {cancelled && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4 font-roboto text-sm">
            Payment was cancelled. You can try again.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 font-roboto text-sm">
            {error}
          </div>
        )}

        {/* Order Summary */}
        <div className="space-y-2 mb-6">
          <h3 className="font-cinzel text-xl mb-3">Order Summary</h3>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between font-roboto text-stone-700 text-sm">
              <span>
                {item.product.name} ({item.product.type === 'kit' ? 'Full Kit' : 'Plans'}) × {item.quantity}
              </span>
              <span>${item.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
        </div>

        {/* Payment Method */}
        <div className="mb-6 pt-4 border-t border-stone-200">
          <h3 className="font-cinzel text-xl mb-3">Payment Method</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-stone-200 rounded cursor-pointer hover:bg-stone-50">
              <input
                type="radio"
                name="payment"
                value="stripe"
                checked={paymentMethod === 'stripe'}
                onChange={() => setPaymentMethod('stripe')}
              />
              <div>
                <span className="font-roboto font-medium text-stone-800">Credit / Debit Card</span>
                <p className="font-roboto text-stone-500 text-xs">Processed securely via Stripe</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-stone-200 rounded cursor-pointer hover:bg-stone-50">
              <input
                type="radio"
                name="payment"
                value="crypto"
                checked={paymentMethod === 'crypto'}
                onChange={() => setPaymentMethod('crypto')}
              />
              <div>
                <span className="font-roboto font-medium text-stone-800">Cryptocurrency</span>
                <p className="font-roboto text-stone-500 text-xs">BTC, ADA, and more · {cryptoFeePercent}% processing fee</p>
              </div>
            </label>
          </div>

          {paymentMethod === 'crypto' && (
            <div className="mt-3 ml-8">
              <label className="block font-roboto text-stone-700 text-sm font-medium mb-1">
                Select Currency
              </label>
              <select
                value={cryptoCurrency}
                onChange={(e) => setCryptoCurrency(e.target.value)}
                className="px-3 py-2 border border-stone-300 rounded font-roboto text-sm"
              >
                <option value="btc">Bitcoin (BTC)</option>
                <option value="ada">Cardano (ADA)</option>
                <option value="eth">Ethereum (ETH)</option>
                <option value="ltc">Litecoin (LTC)</option>
                <option value="xmr">Monero (XMR)</option>
              </select>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="pt-4 border-t border-stone-300 space-y-2">
          <div className="flex justify-between font-roboto text-stone-700">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          {paymentMethod === 'crypto' && (
            <div className="flex justify-between font-roboto text-stone-600 text-sm">
              <span>Crypto processing fee ({cryptoFeePercent}%)</span>
              <span>${cryptoFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="flex justify-between font-cinzel text-xl text-stone-800">
            <span>Total</span>
            <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          {hasKit && (
            <div className="flex justify-between font-roboto text-stone-600 text-sm pt-2 border-t border-stone-200">
              <span>Due today (50% deposit)</span>
              <span className="font-medium">${amountDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleCheckout}
          disabled={processing || items.length === 0}
          className="mt-6 w-full bg-stone-800 text-white font-roboto font-medium py-3 rounded hover:bg-stone-700 transition-colors disabled:opacity-50"
        >
          {processing ? 'Processing...' : hasKit ? 'Pay Deposit' : 'Pay Now'}
        </button>
      </ProductPage>
    </div>
  );
}
