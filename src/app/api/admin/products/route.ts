import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { ApiResponse, Product } from '@/types';

/**
 * 管理画面用：全商品取得API
 * isActiveに関係なくすべての商品を取得
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const products = await prisma.product.findMany({
      where: {
        ...(category && { category }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const response: ApiResponse<Product[]> = {
      success: true,
      data: products,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
