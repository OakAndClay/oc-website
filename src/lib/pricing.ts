import prisma from './prisma';

export type PricingRates = Record<string, number>;

/** Fetch all pricing config as a key→value map */
export async function getPricingRates(): Promise<PricingRates> {
  const configs = await prisma.pricingConfig.findMany();
  const rates: PricingRates = {};
  for (const c of configs) {
    rates[c.key] = c.value;
  }
  return rates;
}

/** Fetch a single pricing rate by key */
export async function getRate(key: string): Promise<number> {
  const config = await prisma.pricingConfig.findUnique({ where: { key } });
  if (!config) throw new Error(`Pricing config key not found: ${key}`);
  return config.value;
}

export interface ProductWithQuantities {
  type: string;
  materialQty: number;
  laborQty: number;
  otherHardCosts: number;
  materialRateKey: string;
  laborRateKey: string;
  planPriceKey: string | null;
}

/** Calculate product price from quantities × global rates */
export function calculateProductPrice(
  product: ProductWithQuantities,
  rates: PricingRates
): number {
  if (product.type === 'plans' && product.planPriceKey) {
    const planPrice = rates[product.planPriceKey];
    if (planPrice === undefined) throw new Error(`Rate key not found: ${product.planPriceKey}`);
    return planPrice;
  }

  const materialRate = rates[product.materialRateKey];
  const laborRate = rates[product.laborRateKey];
  if (materialRate === undefined) throw new Error(`Rate key not found: ${product.materialRateKey}`);
  if (laborRate === undefined) throw new Error(`Rate key not found: ${product.laborRateKey}`);

  return (product.materialQty * materialRate) + (product.laborQty * laborRate) + product.otherHardCosts;
}

/** Apply crypto fee markup to a price */
export function applyCryptoFee(price: number, rates: PricingRates): { total: number; fee: number } {
  const feePercent = rates['crypto_fee_percentage'] ?? 3.5;
  const fee = price * (feePercent / 100);
  return { total: price + fee, fee };
}

/** Calculate deposit amount (50% for kits) */
export function calculateDeposit(price: number, productType: string): number {
  return productType === 'kit' ? Math.round(price * 50) / 100 : price;
}
