import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { COOKIE_NAMES } from '@/lib/constants';

// DELETE /api/cart/[id] - カートアイテムを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const customerId = cookieStore.get(COOKIE_NAMES.LINE_CUSTOMER_ID)?.value;

  if (!customerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // カートアイテムの存在確認と所有権チェック
    const existingCartItem = await prisma.cartItem.findUnique({
      where: { id },
    });

    if (!existingCartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    if (existingCartItem.customerId !== customerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 削除
    await prisma.cartItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('カート削除エラー:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
