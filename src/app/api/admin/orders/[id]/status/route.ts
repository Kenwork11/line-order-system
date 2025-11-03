import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateOrderStatusSchema } from '@/lib/validations/order';
import { canTransitionStatus } from '@/lib/order-utils';

/**
 * PATCH /api/admin/orders/[id]/status
 * 注文ステータスを更新
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // バリデーション
    const validation = updateOrderStatusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: '不正なリクエストです', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { status: newStatus } = validation.data;

    // 現在の注文を取得
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: '注文が見つかりません' },
        { status: 404 }
      );
    }

    // ステータス遷移のチェック
    if (!canTransitionStatus(currentOrder.status, newStatus)) {
      return NextResponse.json(
        {
          error: `ステータスを ${currentOrder.status} から ${newStatus} に変更できません`,
        },
        { status: 400 }
      );
    }

    // ステータス更新
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: newStatus,
        completedAt: newStatus === 'completed' ? new Date() : undefined,
      },
      include: {
        customer: {
          select: {
            id: true,
            displayName: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Failed to update order status:', error);
    return NextResponse.json(
      { error: 'ステータスの更新に失敗しました' },
      { status: 500 }
    );
  }
}
