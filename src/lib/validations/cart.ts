import { z } from 'zod';

/**
 * カートアイテム追加・更新（upsert）のバリデーションスキーマ
 */
export const upsertCartItemSchema = z.object({
  productId: z.string({
    message: 'Product ID is required',
  }),
  quantity: z
    .number({
      message: 'Quantity must be a number',
    })
    .int({ message: 'Quantity must be an integer' })
    .positive({ message: 'Quantity must be a positive number' }),
});

/**
 * カートアイテム追加・更新のリクエストボディ型
 */
export type UpsertCartItemRequest = z.infer<typeof upsertCartItemSchema>;
