'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductPage from '@/components/ProductPage';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  type: string;
  calculatedPrice: number;
}

export default function KitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        // Show only kit-type products on the listing page
        setProducts(Array.isArray(data) ? data.filter((p: Product) => p.type === 'kit') : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col items-center mt-12 px-4 w-full">
      <ProductPage className="mb-8">
        <h2 className="font-cinzel text-4xl mb-2 text-center">Timber Frame Kits</h2>
        <p className="font-roboto text-stone-600 text-center">
          Each kit includes precision-cut timbers with traditional joinery, ready for assembly.
        </p>
      </ProductPage>

      {loading ? (
        <p className="font-roboto text-stone-600">Loading kits...</p>
      ) : products.length === 0 ? (
        <ProductPage>
          <p className="font-roboto text-stone-600 text-center">
            No kits available at this time. Check back soon!
          </p>
        </ProductPage>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full mb-20 px-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/kits/${product.slug}`}
              className="bg-white/70 rounded shadow-gray-700 shadow-xl border-2 border-gray-900 overflow-hidden hover:shadow-2xl transition-shadow group"
            >
              {product.images[0] && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-cinzel text-2xl text-stone-800 mb-2">{product.name}</h3>
                <p className="font-roboto text-stone-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <p className="font-cinzel text-xl text-stone-800">
                  Starting at ${product.calculatedPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
