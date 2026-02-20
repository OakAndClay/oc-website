import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPricingRates, calculateProductPrice } from '@/lib/pricing';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const rates = await getPricingRates();
    const calculatedPrice = calculateProductPrice(product, rates);

    // Also find the plans version if this is a kit, or vice versa
    const baseSlug = slug.replace(/-plans$/, '');
    const relatedProducts = await prisma.product.findMany({
      where: {
        slug: { startsWith: baseSlug },
        active: true,
        id: { not: product.id },
      },
    });

    const relatedWithPrices = relatedProducts.map((p) => ({
      ...p,
      calculatedPrice: calculateProductPrice(p, rates),
    }));

    return NextResponse.json({
      ...product,
      calculatedPrice,
      relatedProducts: relatedWithPrices,
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
