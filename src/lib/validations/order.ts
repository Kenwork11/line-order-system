import { z } from 'zod';

// 注文ステータス更新のバリデーション
export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'completed',
    'cancelled',
  ]),
});

// 支払いステータス更新のバリデーション
export const updatePaymentStatusSchema = z.object({
  payment_status: z.enum(['pending', 'paid']),
  payment_method: z.string().optional(),
});

// 型推論用のエクスポート
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type UpdatePaymentStatusInput = z.infer<
  typeof updatePaymentStatusSchema
>;
