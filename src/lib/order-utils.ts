import type { OrderStatus } from '@prisma/client';

// ステータス遷移のルール
const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

/**
 * ステータス遷移が可能かチェック
 */
export function canTransitionStatus(
  from: OrderStatus,
  to: OrderStatus
): boolean {
  return STATUS_TRANSITIONS[from].includes(to);
}

/**
 * 次のステータスを取得（通常フロー）
 */
export function getNextStatus(current: OrderStatus): OrderStatus | null {
  const flowOrder: OrderStatus[] = [
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'completed',
  ];
  const currentIndex = flowOrder.indexOf(current);

  if (currentIndex === -1 || currentIndex === flowOrder.length - 1) {
    return null;
  }

  return flowOrder[currentIndex + 1];
}

/**
 * 注文番号を生成（ORD-YYYYMMDD-XXXX形式）
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');

  return `ORD-${year}${month}${day}-${random}`;
}

/**
 * 相対時間を取得（例: "5分前"、"2時間前"）
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}日前`;
  } else if (hours > 0) {
    return `${hours}時間前`;
  } else if (minutes > 0) {
    return `${minutes}分前`;
  } else {
    return 'たった今';
  }
}
