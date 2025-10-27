import { z } from 'zod';

/**
 * カートアイテム追加・更新（upsert）のバリデーションスキーマ
 */
export const upsertCartItemSchema = z.object({
  productId: z.string({
    message: '商品IDは必須です',
  }),
  quantity: z
    .number({
      message: '数量は数値である必要があります',
    })
    .int({ message: '数量は整数である必要があります' })
    .positive({ message: '数量は正の数である必要があります' }),
});

/**
 * カートアイテム追加・更新のリクエストボディ型
 */
export type UpsertCartItemRequest = z.infer<typeof upsertCartItemSchema>;
