import { CartItem, Product } from '@prisma/client';

/**
 * 商品情報を含むカートアイテム
 */
export type CartItemWithProduct = CartItem & { product: Product };
