import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    const paymentType = session.metadata?.type;

    if (!orderId) {
      console.error('No orderId in Stripe session metadata');
      return NextResponse.json({ received: true });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      console.error('Order not found:', orderId);
      return NextResponse.json({ received: true });
    }

    if (paymentType === 'balance') {
      // Balance payment for kit
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'balance_paid', balancePaidAt: new Date() },
      });
    } else if (order.depositAmount) {
      // Deposit payment for kit
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'deposit_paid', depositPaidAt: new Date() },
      });
    } else {
      // Full payment (plans)
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'completed', depositPaidAt: new Date() },
      });
    }
  }

  return NextResponse.json({ received: true });
}
