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

    // 削除（所有権チェック付き）
    await prisma.cartItem.delete({
      where: {
        id,
        customerId, // 自分のカートアイテムのみ削除可能
      },
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    // Prisma error: レコードが見つからない（存在しないor他人のカート）
    const ERROR_CODE_NO_DATA = 'P2025';
    const hasError = error && typeof error === 'object' && 'code' in error;
    const isNotFoundItem = hasError && error.code === ERROR_CODE_NO_DATA;

    if (isNotFoundItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    console.error('カート削除エラー:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
