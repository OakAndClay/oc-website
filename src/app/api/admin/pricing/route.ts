import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!(session?.user as unknown as Record<string, unknown>)?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const configs = await prisma.pricingConfig.findMany({ orderBy: { key: 'asc' } });
  return NextResponse.json(configs);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!(session?.user as unknown as Record<string, unknown>)?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { key, value, description } = await req.json();

  if (!key || value === undefined) {
    return NextResponse.json({ error: 'Key and value required' }, { status: 400 });
  }

  const config = await prisma.pricingConfig.upsert({
    where: { key },
    update: { value: Number(value), description },
    create: { key, value: Number(value), description },
  });

  return NextResponse.json(config);
}
