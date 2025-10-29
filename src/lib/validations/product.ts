/**
 * 商品データのバリデーションスキーマ
 * Zodを使用してフロントエンドとバックエンドで共通のバリデーションを提供
 */

import { z } from 'zod';

/**
 * 商品カテゴリの定数定義
 */
export const PRODUCT_CATEGORIES = ['バーガー', 'サイド', '飲み物'] as const;

/**
 * 商品作成時のバリデーションスキーマ
 */
export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, '商品名は必須です')
    .max(255, '商品名は255文字以内で入力してください'),
  description: z
    .string()
    .max(1000, '説明は1000文字以内で入力してください')
    .nullable()
    .optional(),
  price: z
    .number()
    .int('価格は整数で入力してください')
    .min(0, '価格は0円以上で入力してください')
    .max(1000000, '価格は1,000,000円以下で入力してください'),
  imageUrl: z
    .string()
    .url('有効なURLを入力してください')
    .nullable()
    .optional()
    .or(z.literal('')), // 空文字列も許可
  category: z
    .enum(PRODUCT_CATEGORIES, {
      message: `カテゴリは${PRODUCT_CATEGORIES.join('、')}のいずれかを選択してください`,
    })
    .nullable()
    .optional(),
  isActive: z.boolean().default(true),
});

/**
 * 商品更新時のバリデーションスキーマ
 * 作成時のスキーマと同じ
 */
export const updateProductSchema = createProductSchema;

/**
 * 商品作成時のリクエストボディの型
 */
export type CreateProductInput = z.infer<typeof createProductSchema>;

/**
 * 商品更新時のリクエストボディの型
 */
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
