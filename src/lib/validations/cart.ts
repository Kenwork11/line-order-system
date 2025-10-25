import { z } from 'zod';

/**
 * カートアイテム数量更新のバリデーションスキーマ
 */
export const updateCartItemSchema = z.object({
  quantity: z
    .number({
      message: 'Quantity must be a number',
    })
    .int({ message: 'Quantity must be an integer' })
    .positive({ message: 'Quantity must be a positive number' }),
});

/**
 * カートアイテム数量更新のリクエストボディ型
 */
export type UpdateCartItemRequest = z.infer<typeof updateCartItemSchema>;
