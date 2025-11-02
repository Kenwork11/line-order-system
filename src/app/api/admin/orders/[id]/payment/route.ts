import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updatePaymentStatusSchema } from '@/lib/validations/order';

/**
 * PATCH /api/admin/orders/[id]/payment
 * 支払いステータスを更新
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // バリデーション
    const validation = updatePaymentStatusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: '不正なリクエストです', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { payment_status, payment_method } = validation.data;

    // 支払いステータス更新
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus: payment_status,
        paymentMethod: payment_method || null,
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
    console.error('Failed to update payment status:', error);
    return NextResponse.json(
      { error: '支払いステータスの更新に失敗しました' },
      { status: 500 }
    );
  }
}
