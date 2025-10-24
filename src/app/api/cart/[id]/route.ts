import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

// PATCH /api/cart/[id] - カートアイテムの数量を変更
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const customerId = cookieStore.get('line_customer_id')?.value;

  if (!customerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { quantity } = body;

    // バリデーション
    if (typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be a positive number' },
        { status: 400 }
      );
    }

    // カートアイテムの存在確認と所有権チェック
    const existingCartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: { product: true },
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

    // 数量を更新
    const updatedCartItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    });

    return NextResponse.json({
      id: updatedCartItem.id,
      productId: updatedCartItem.product.id,
      productName: updatedCartItem.product.name,
      price: updatedCartItem.product.price,
      quantity: updatedCartItem.quantity,
      subtotal: updatedCartItem.product.price * updatedCartItem.quantity,
    });
  } catch (error) {
    console.error('カート更新エラー:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
