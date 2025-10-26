import { CartItem, Product } from '@prisma/client';

/**
 * 商品情報を含むカートアイテム
 */
export type CartItemWithProduct = CartItem & { product: Product };

/**
 * カート削除レスポンス（非アクティブ商品の自動削除時）
 */
export type CartDeletedResponse = {
  deleted: true;
  productId: string;
  productName: string;
  message: string;
};
