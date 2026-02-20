import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getPricingRates, calculateProductPrice, applyCryptoFee } from '@/lib/pricing';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { paymentMethod } = await req.json() as { paymentMethod: 'stripe' | 'crypto' };

  // Get cart items
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  if (!cartItems.length) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  const rates = await getPricingRates();

  // Calculate totals
  let subtotal = 0;
  const orderItems = cartItems.map((item) => {
    const unitPrice = calculateProductPrice(item.product, rates);
    const total = unitPrice * item.quantity;
    subtotal += total;
    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPrice,
      total,
    };
  });

  // Determine if any item is a kit (needs deposit) or all plans (full payment)
  const hasKit = cartItems.some((item) => item.product.type === 'kit');

  let cryptoFee = 0;
  let finalTotal = subtotal;

  if (paymentMethod === 'crypto') {
    const result = applyCryptoFee(subtotal, rates);
    cryptoFee = result.fee;
    finalTotal = result.total;
  }

  // For kits: 50% deposit; for plans: full payment
  const amountDue = hasKit ? Math.round(finalTotal * 50) / 100 : finalTotal;

  // Create order
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      status: 'pending',
      paymentMethod,
      subtotal,
      cryptoFee,
      total: finalTotal,
      depositAmount: hasKit ? amountDue : null,
      items: { create: orderItems },
    },
  });

  // Clear cart
  await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });

  if (paymentMethod === 'stripe') {
    // Create Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: hasKit
                ? `Oak and Clay Order (50% Deposit)`
                : 'Oak and Clay Order',
            },
            unit_amount: Math.round(amountDue * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?cancelled=true`,
      metadata: { orderId: order.id },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentId: stripeSession.id },
    });

    return NextResponse.json({ url: stripeSession.url, orderId: order.id });
  }

  // Crypto payment - return order ID for NOWPayments flow
  return NextResponse.json({ orderId: order.id, amountDue, paymentMethod: 'crypto' });
}
