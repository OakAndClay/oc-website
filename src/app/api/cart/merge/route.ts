import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Merge guest cart (from localStorage) into DB cart on login
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { items } = await req.json() as { items: { productId: string; quantity: number }[] };

  if (!items?.length) {
    return NextResponse.json({ success: true });
  }

  for (const item of items) {
    await prisma.cartItem.upsert({
      where: { userId_productId: { userId: session.user.id, productId: item.productId } },
      update: { quantity: { increment: item.quantity } },
      create: { userId: session.user.id, productId: item.productId, quantity: item.quantity },
    });
  }

  return NextResponse.json({ success: true });
}
