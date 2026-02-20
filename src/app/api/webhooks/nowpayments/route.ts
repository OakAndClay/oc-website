import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('x-nowpayments-sig');

  // Verify HMAC signature
  if (process.env.NOWPAYMENTS_IPN_SECRET && sig) {
    const hmac = crypto
      .createHmac('sha512', process.env.NOWPAYMENTS_IPN_SECRET)
      .update(body)
      .digest('hex');

    if (hmac !== sig) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  }

  const data = JSON.parse(body);

  if (data.payment_status === 'finished' || data.payment_status === 'confirmed') {
    const orderId = data.order_id;

    if (!orderId) {
      return NextResponse.json({ received: true });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ received: true });
    }

    if (order.status === 'pending') {
      if (order.depositAmount) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'deposit_paid', depositPaidAt: new Date() },
        });
      } else {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'completed', depositPaidAt: new Date() },
        });
      }
    } else if (order.status === 'deposit_paid') {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'balance_paid', balancePaidAt: new Date() },
      });
    }
  }

  return NextResponse.json({ received: true });
}
