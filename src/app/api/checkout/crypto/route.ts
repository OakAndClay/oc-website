import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createPayment } from '@/lib/nowpayments';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { orderId, currency } = await req.json() as { orderId: string; currency: string };

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id, status: 'pending' },
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const amountDue = order.depositAmount ?? order.total;

  const payment = await createPayment({
    priceAmount: amountDue,
    priceCurrency: 'usd',
    payCurrency: currency, // 'btc', 'ada', etc.
    orderId: order.id,
    orderDescription: `Oak and Clay Order ${order.id}`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { nowpaymentsId: String(payment.payment_id) },
  });

  return NextResponse.json(payment);
}
