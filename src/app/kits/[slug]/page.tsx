'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductPage from '@/components/ProductPage';
import AddToCartButton from '@/components/cart/AddToCartButton';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  type: string;
  calculatedPrice: number;
  materialQty: number;
  laborQty: number;
  otherHardCosts: number;
}

interface ProductDetail extends Product {
  relatedProducts: Product[];
}

export default function KitDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setProduct(null);
        } else {
          setProduct(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-12 px-4 w-full">
        <p className="font-roboto text-stone-600">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center mt-12 px-4 w-full">
        <ProductPage>
          <h2 className="font-cinzel text-3xl text-center">Kit Not Found</h2>
        </ProductPage>
      </div>
    );
  }

  const plansProduct = product.relatedProducts.find((p) => p.type === 'plans');
  const depositAmount = product.type === 'kit' ? product.calculatedPrice * 0.5 : null;

  return (
    <div className="flex flex-col items-center mt-12 px-4 w-full max-w-5xl mx-auto mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {/* Images */}
        <div className="space-y-4">
          {product.images.length > 0 && (
            <>
              <div className="bg-white/70 rounded shadow-gray-700 shadow-xl border-2 border-gray-900 overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded border-2 overflow-hidden ${
                        i === selectedImage ? 'border-stone-800' : 'border-stone-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Product Info */}
        <ProductPage>
          <h2 className="font-cinzel text-3xl mb-2">{product.name}</h2>
          <p className="font-cinzel text-2xl text-stone-800 mb-4">
            ${product.calculatedPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>

          {depositAmount && (
            <p className="font-roboto text-stone-600 text-sm mb-4">
              50% deposit required: ${depositAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              <br />
              Balance due before fabrication.
            </p>
          )}

          <div className="font-roboto text-stone-700 mb-6 whitespace-pre-line">
            {product.description}
          </div>

          <div className="space-y-3">
            <AddToCartButton productId={product.id} label="Add Kit to Cart" />

            {plansProduct && (
              <div className="pt-4 border-t border-stone-200">
                <p className="font-roboto text-stone-600 text-sm mb-2">
                  Just need the plans? Piece drawings available:
                </p>
                <div className="flex items-center gap-4">
                  <span className="font-cinzel text-lg text-stone-800">
                    ${plansProduct.calculatedPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <AddToCartButton productId={plansProduct.id} label="Add Plans to Cart" />
                </div>
              </div>
            )}
          </div>
        </ProductPage>
      </div>
    </div>
  );
}
