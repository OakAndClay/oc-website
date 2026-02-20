import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

// Pay remaining balance on a kit order
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { orderId } = await req.json();

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id, status: 'deposit_paid' },
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found or not eligible for balance payment' }, { status: 404 });
  }

  const balanceDue = order.total - (order.depositAmount ?? 0);

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: `Oak and Clay Order Balance - ${order.id}` },
          unit_amount: Math.round(balanceDue * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}?balance_paid=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}`,
    metadata: { orderId: order.id, type: 'balance' },
  });

  return NextResponse.json({ url: stripeSession.url });
}
