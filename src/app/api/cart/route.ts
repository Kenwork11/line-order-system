import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const BASE_ADD_QUANTITY = 1;

// TODO: LINE連携実装後、user_idまたはline_user_idを追加してカートをユーザーごとに管理する
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity = BASE_ADD_QUANTITY } = body;

    // バリデーション
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be a positive number' },
        { status: 400 }
      );
    }

    // 商品の存在確認
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (!product.isActive) {
      return NextResponse.json(
        { error: 'Product is not available' },
        { status: 400 }
      );
    }

    // トランザクションを使って競合状態を防ぐ
    const cartItem = await prisma.$transaction(async (tx) => {
      const existingCartItem = await tx.cartItem.findFirst({
        where: { productId },
      });

      const data = existingCartItem
        ? { quantity: { increment: quantity } }
        : { productId, quantity };

      return await tx.cartItem.upsert({
        where: { id: existingCartItem?.id ?? 0 },
        update: data,
        create: data as { productId: string; quantity: number },
        include: {
          product: true,
        },
      });
    });

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
