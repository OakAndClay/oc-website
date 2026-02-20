import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPricingRates, calculateProductPrice } from '@/lib/pricing';

export async function GET() {
  try {
    const [products, rates] = await Promise.all([
      prisma.product.findMany({ where: { active: true }, orderBy: { name: 'asc' } }),
      getPricingRates(),
    ]);

    const productsWithPrices = products.map((p) => ({
      ...p,
      calculatedPrice: calculateProductPrice(p, rates),
    }));

    return NextResponse.json(productsWithPrices);
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
