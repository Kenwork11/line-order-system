import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { COOKIE_NAMES } from '@/lib/constants';

/**
 * POST /api/orders - カートから注文を作成
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const customerId = cookieStore.get(COOKIE_NAMES.LINE_CUSTOMER_ID)?.value;

  if (!customerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // カートアイテムを取得（数量0のものは除外）
    const cartItems = await prisma.cartItem.findMany({
      where: {
        customerId,
        quantity: { gt: 0 },
      },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'カートが空です' }, { status: 400 });
    }

    // 合計金額を計算
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // 注文番号を生成（例: ORD-20251104-123456）
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // トランザクションで注文作成 + カート削除
    const order = await prisma.$transaction(async (tx) => {
      // 注文を作成
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId,
          status: 'pending',
          totalAmount,
          paymentStatus: 'pending',
          orderItems: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              productPrice: item.product.price,
              quantity: item.quantity,
              subtotal: item.product.price * item.quantity,
            })),
          },
        },
        include: {
          orderItems: true,
        },
      });

      // カートを空にする
      await tx.cartItem.deleteMany({
        where: { customerId },
      });

      return newOrder;
    });

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('注文作成エラー:', error);
    return NextResponse.json(
      { error: '注文の作成に失敗しました' },
      { status: 500 }
    );
  }
}
