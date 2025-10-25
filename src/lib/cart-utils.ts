import { CartItemWithProduct } from '@/types/cart';

export const formatCartItemForResponse = (item: CartItemWithProduct) => ({
  id: item.id,
  productId: item.product.id,
  productName: item.product.name,
  productDescription: item.product.description,
  productImageUrl: item.product.imageUrl,
  productCategory: item.product.category,
  price: item.product.price,
  quantity: item.quantity,
  subtotal: item.product.price * item.quantity,
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
});
