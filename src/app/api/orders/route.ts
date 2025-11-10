import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { COOKIE_NAMES } from '@/lib/constants';
import type { OrderForUI, OrderItemForUI } from '@/types/order';

// GET /api/orders - 注文履歴を取得
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const customerId = cookieStore.get(COOKIE_NAMES.LINE_CUSTOMER_ID)?.value;

  if (!customerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { customerId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Prisma型からUI型へ変換
    const ordersForUI: OrderForUI[] = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt.toISOString(),
      orderItems: order.orderItems.map(
        (item): OrderItemForUI => ({
          id: item.id,
          productName: item.product.name,
          productPrice: item.productPrice,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })
      ),
    }));

    return NextResponse.json(ordersForUI);
  } catch (error) {
    console.error('注文履歴取得エラー:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
