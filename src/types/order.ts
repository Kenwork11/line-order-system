import type {
  Order,
  OrderItem,
  Customer,
  Product,
  OrderStatus,
  PaymentStatus,
} from '@prisma/client';

// 注文詳細（顧客情報と注文商品を含む）
export type OrderWithDetails = Order & {
  customer: Customer;
  orderItems: (OrderItem & { product: Product })[];
};

// 注文ステータスのラベル（日本語）
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: '注文確認中',
  confirmed: '確認済み',
  preparing: '準備中',
  ready: '受取可能',
  completed: '完了',
  cancelled: 'キャンセル',
};

// 注文ステータスの色（Tailwind CSS用）
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'gray',
  confirmed: 'blue',
  preparing: 'yellow',
  ready: 'green',
  completed: 'slate',
  cancelled: 'red',
};

// 支払いステータスのラベル（日本語）
export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: '未払い',
  paid: '支払済み',
};

// 支払いステータスの色（Tailwind CSS用）
export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  pending: 'orange',
  paid: 'green',
};

// 注文ステータスの遷移順序
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'completed',
];

// エクスポート型（再エクスポート）
export type { OrderStatus, PaymentStatus };

// UIコンポーネント用の型定義（APIレスポンス形式）
export interface OrderItemForUI {
  id: string;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderForUI {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItemForUI[];
}
