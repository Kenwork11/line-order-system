import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { OrderStatus } from '@prisma/client';

/**
 * GET /api/admin/orders
 * 注文一覧を取得
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as OrderStatus | null;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // クエリ条件の構築
    const where = status ? { status } : {};

    // 注文一覧を取得
    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            displayName: true,
            pictureUrl: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // 総件数を取得
    const total = await prisma.order.count({ where });

    return NextResponse.json({
      orders,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { error: '注文一覧の取得に失敗しました' },
      { status: 500 }
    );
  }
}
