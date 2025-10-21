import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const customerId = cookieStore.get('line_customer_id')?.value;

  if (!customerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    if (!customer.isActive) {
      return NextResponse.json({ error: 'Account inactive' }, { status: 403 });
    }

    return NextResponse.json({
      id: customer.id,
      lineUserId: customer.lineUserId,
      displayName: customer.displayName,
      pictureUrl: customer.pictureUrl,
      nickname: customer.nickname,
      isActive: customer.isActive,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
      lastLoginAt: customer.lastLoginAt?.toISOString() || null,
    });
  } catch (error) {
    console.error('顧客情報取得エラー:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
