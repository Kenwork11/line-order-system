import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { COOKIE_NAMES } from '@/lib/constants';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Day.jsのタイムゾーンプラグインを有効化
dayjs.extend(utc);
dayjs.extend(timezone);

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
    // リクエストボディからカート情報を取得（フロントエンドの数量を使用）
    const body = await request.json();
    const { items: clientCartItems } = body;

    if (!clientCartItems || clientCartItems.length === 0) {
      return NextResponse.json({ error: 'カートが空です' }, { status: 400 });
    }

    // DBから商品情報を取得（価格・在庫確認のため）
    const productIds = clientCartItems.map(
      (item: { productId: string }) => item.productId
    );
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    });

    if (products.length !== clientCartItems.length) {
      return NextResponse.json(
        { error: '一部の商品が利用できません' },
        { status: 400 }
      );
    }

    // 商品情報とクライアントの数量をマージ
    type CartItemWithProduct = {
      productId: string;
      product: (typeof products)[number];
      quantity: number;
    };

    const cartItems = clientCartItems
      .map(
        (clientItem: {
          productId: string;
          quantity: number;
        }): CartItemWithProduct | null => {
          const product = products.find((p) => p.id === clientItem.productId);
          if (!product || clientItem.quantity <= 0) return null;
          return {
            productId: product.id,
            product,
            quantity: clientItem.quantity,
          };
        }
      )
      .filter(
        (item: CartItemWithProduct | null): item is CartItemWithProduct =>
          item !== null
      );

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'カートが空です' }, { status: 400 });
    }

    // 合計金額を計算
    const totalAmount = cartItems.reduce(
      (sum: number, item: CartItemWithProduct) =>
        sum + item.product.price * item.quantity,
      0
    );

    // トランザクションで注文作成 + カート削除
    const order = await prisma.$transaction(
      async (tx) => {
        // 日付-連番形式の注文番号を生成（例: 20251104-001）
        // Day.jsを使用して環境に依存せず日本時間（JST）で日付を取得
        const today = dayjs().tz('Asia/Tokyo').format('YYYYMMDD');

        // 当日の最新注文番号を取得して連番を決定
        const latestOrder = await tx.order.findFirst({
          where: {
            orderNumber: {
              startsWith: `${today}-`,
            },
          },
          orderBy: {
            orderNumber: 'desc',
          },
          select: {
            orderNumber: true,
          },
        });

        const lastSequence = latestOrder?.orderNumber.split('-')[1];
        const sequenceNumber = lastSequence ? parseInt(lastSequence) + 1 : 1;

        const orderNumber = `${today}-${sequenceNumber.toString().padStart(3, '0')}`;

        // 注文を作成
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            customerId,
            status: 'pending',
            totalAmount,
            paymentStatus: 'pending',
            orderItems: {
              create: cartItems.map((item: CartItemWithProduct) => ({
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
      },
      {
        maxWait: 5000,
        timeout: 10000,
      }
    );

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
