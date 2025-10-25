import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { formatCartItemForResponse } from '@/lib/cart-utils';

const DEFAULT_QUANTITY = 1;

// GET /api/cart - カート内容を取得
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const customerId = cookieStore.get('line_customer_id')?.value;

  if (!customerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { customerId },
      include: {
        product: true, // 最新の商品情報（価格含む）を取得
      },
      orderBy: { createdAt: 'desc' },
    });

    // レスポンス整形
    const formattedItems = cartItems.map(formatCartItemForResponse);

    const totalAmount = formattedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    return NextResponse.json({
      items: formattedItems,
      totalAmount,
      itemCount: formattedItems.length,
    });
  } catch (error) {
    console.error('カート取得エラー:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// POST /api/cart - 商品をカートに追加
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const customerId = cookieStore.get('line_customer_id')?.value;

  if (!customerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productId, quantity = DEFAULT_QUANTITY } = body;

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

    // トランザクションで競合状態を防ぐ
    const cartItem = await prisma.$transaction(async (tx) => {
      const existingCartItem = await tx.cartItem.findUnique({
        where: {
          customerId_productId: {
            customerId,
            productId,
          },
        },
      });

      if (existingCartItem) {
        // 既存のアイテムがあれば数量を加算
        return await tx.cartItem.update({
          where: { id: existingCartItem.id },
          data: {
            quantity: {
              increment: quantity,
            },
          },
          include: {
            product: true,
          },
        });
      } else {
        // 新規にカートアイテムを作成
        return await tx.cartItem.create({
          data: {
            customerId,
            productId,
            quantity,
          },
          include: {
            product: true,
          },
        });
      }
    });

    return NextResponse.json(formatCartItemForResponse(cartItem), {
      status: 201,
    });
  } catch (error) {
    console.error('カート追加エラー:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
