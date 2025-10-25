import { z } from 'zod';

/**
 * カートアイテム数量更新のバリデーションスキーマ
 */
export const updateCartItemSchema = z.object({
  quantity: z
    .number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a number',
    })
    .int('Quantity must be an integer')
    .positive('Quantity must be a positive number'),
});

/**
 * カートアイテム数量更新のリクエストボディ型
 */
export type UpdateCartItemRequest = z.infer<typeof updateCartItemSchema>;
