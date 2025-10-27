import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { formatCartItemForResponse } from '@/lib/cart-utils';
import { COOKIE_NAMES } from '@/lib/constants';
import { upsertCartItemSchema } from '@/lib/validations/cart';

// GET /api/cart - カート内容を取得
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const customerId = cookieStore.get(COOKIE_NAMES.LINE_CUSTOMER_ID)?.value;

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

// POST /api/cart - 商品をカートに追加・更新（upsert）
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const customerId = cookieStore.get(COOKIE_NAMES.LINE_CUSTOMER_ID)?.value;

  if (!customerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Zodバリデーション
    const validationResult = upsertCartItemSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { productId, quantity } = validationResult.data;

    // 商品の存在確認
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // 非アクティブ商品の処理
    if (!product.isActive) {
      // 既存カートアイテムを削除（存在しなければcount=0）
      const { count } = await prisma.cartItem.deleteMany({
        where: {
          customerId,
          productId,
        },
      });

      // count > 0: 既存アイテムの更新リクエスト → 削除成功
      if (count > 0) {
        return NextResponse.json(
          {
            deleted: true,
            productId,
            productName: product.name,
            message: '商品が販売停止になったため、カートから削除されました',
          },
          { status: 200 }
        );
      }

      // count === 0: 新規追加リクエスト → エラー
      return NextResponse.json(
        { error: 'Product is not available' },
        { status: 400 }
      );
    }

    // upsert: 既存データがあれば数量を上書き、なければ新規作成
    const cartItem = await prisma.cartItem.upsert({
      where: {
        customerId_productId: {
          customerId,
          productId,
        },
      },
      update: {
        quantity, // 上書き（incrementではなくset）
      },
      create: {
        customerId,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(formatCartItemForResponse(cartItem), {
      status: 200,
    });
  } catch (error) {
    console.error('カート追加エラー:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
