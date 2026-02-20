'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductPage from '@/components/ProductPage';

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product: {
    name: string;
    type: string;
  };
}

interface Order {
  id: string;
  status: string;
  paymentMethod: string;
  total: number;
  depositAmount: number | null;
  createdAt: string;
  items: OrderItem[];
}

const statusLabels: Record<string, string> = {
  pending: 'Pending Payment',
  deposit_paid: 'Deposit Paid',
  balance_paid: 'Balance Paid',
  fabrication_scheduled: 'Fabrication Scheduled',
  shipped: 'Shipped',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/session').then((r) => r.json()),
      fetch('/api/orders').then((r) => r.json()),
    ]).then(([session, ordersData]) => {
      if (!session?.user) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setLoading(false);
    }).catch(() => router.push('/login'));
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-12">
        <p className="font-roboto text-stone-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-12 px-4 w-full">
      <ProductPage className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-cinzel text-3xl">My Account</h2>
            <p className="font-roboto text-stone-600">{user?.name} · {user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="font-roboto text-stone-600 hover:text-stone-800 text-sm underline"
          >
            Sign Out
          </button>
        </div>
      </ProductPage>

      <ProductPage className="mb-20">
        <h3 className="font-cinzel text-2xl mb-4">Order History</h3>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-roboto text-stone-600 mb-4">No orders yet.</p>
            <Link
              href="/kits"
              className="inline-block bg-stone-800 text-white font-roboto font-medium px-6 py-3 rounded hover:bg-stone-700 transition-colors"
            >
              Browse Kits
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const hasKit = order.items.some((i) => i.product.type === 'kit');
              const balanceDue = order.depositAmount ? order.total - order.depositAmount : 0;

              return (
                <div key={order.id} className="border border-stone-200 rounded p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-roboto text-stone-500 text-xs">
                        Order {order.id.slice(0, 8)}... · {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="font-roboto font-medium text-stone-800">
                        {statusLabels[order.status] || order.status}
                      </p>
                    </div>
                    <p className="font-cinzel text-lg text-stone-800">
                      ${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="space-y-1 mb-3">
                    {order.items.map((item) => (
                      <p key={item.id} className="font-roboto text-stone-600 text-sm">
                        {item.product.name} ({item.product.type === 'kit' ? 'Kit' : 'Plans'}) × {item.quantity}
                      </p>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {/* Balance payment button for deposit_paid kits */}
                    {order.status === 'deposit_paid' && hasKit && (
                      <Link
                        href={`/orders/${order.id}`}
                        className="inline-block bg-stone-800 text-white font-roboto text-sm font-medium px-4 py-2 rounded hover:bg-stone-700 transition-colors"
                      >
                        Pay Balance (${balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                      </Link>
                    )}

                    {/* Download link for completed plans */}
                    {order.status === 'completed' && order.items.some((i) => i.product.type === 'plans') && (
                      <Link
                        href={`/orders/${order.id}/download`}
                        className="inline-block bg-stone-700 text-white font-roboto text-sm font-medium px-4 py-2 rounded hover:bg-stone-600 transition-colors"
                      >
                        Download Plans
                      </Link>
                    )}

                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-block border border-stone-300 text-stone-700 font-roboto text-sm font-medium px-4 py-2 rounded hover:bg-stone-50 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ProductPage>
    </div>
  );
}
