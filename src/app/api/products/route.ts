import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  createProductSchema,
  PRODUCT_CATEGORIES,
} from '@/lib/validations/product';
import { ZodError } from 'zod';

const VALID_CATEGORIES = PRODUCT_CATEGORIES;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // カテゴリパラメータの検証
    if (
      category &&
      !VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])
    ) {
      return NextResponse.json(
        {
          error: `Invalid category. Valid categories are: ${VALID_CATEGORIES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(category && { category }),
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validatedData = createProductSchema.parse(body);

    // 空文字列をnullに変換
    const productData = {
      ...validatedData,
      description: validatedData.description || null,
      imageUrl: validatedData.imageUrl || null,
      category: validatedData.category || null,
    };

    // 商品を作成
    const product = await prisma.product.create({
      data: productData,
    });

    const response = {
      success: true,
      data: product,
      message: 'Product created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
