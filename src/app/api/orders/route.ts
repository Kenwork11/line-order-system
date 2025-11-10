import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { COOKIE_NAMES } from '@/lib/constants';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { OrderForUI } from '@/types/order';

// Day.jsのタイムゾーンプラグインを有効化
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * GET /api/orders - 注文履歴を取得（カーソルベースページネーション）
 */
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const customerId = cookieStore.get(COOKIE_NAMES.LINE_CUSTOMER_ID)?.value;

  if (!customerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const orders = await prisma.order.findMany({
      where: { customerId },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: true,
      },
    });

    const hasMore = orders.length > limit;
    const ordersToReturn = hasMore ? orders.slice(0, limit) : orders;
    const nextCursor = hasMore ? orders[limit].id : null;

    const ordersForUI: OrderForUI[] = ordersToReturn.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt.toISOString(),
      orderItems: order.orderItems.map((item) => ({
        id: item.id,
        productName: item.productName,
        productPrice: item.productPrice,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    }));

    return NextResponse.json({
      orders: ordersForUI,
      nextCursor,
    });
  } catch (error) {
    console.error('注文履歴取得エラー:', error);
    return NextResponse.json(
      { error: '注文履歴の取得に失敗しました' },
      { status: 500 }
    );
  }
}

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
