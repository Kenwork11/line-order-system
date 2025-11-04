'use client';

import { useState } from 'react';
import type {
  OrderWithDetails,
  OrderStatus,
  PaymentStatus,
} from '@/types/order';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PAYMENT_STATUS_LABELS, ORDER_STATUS_LABELS } from '@/types/order';
import { getRelativeTime, getNextStatus } from '@/lib/order-utils';
import { useOrderActions } from '@/hooks/useOrderActions';

interface OrderCardProps {
  order: OrderWithDetails;
  onUpdate?: () => void;
}

export function OrderCard({ order, onUpdate }: OrderCardProps) {
  const { updateStatus, updatePayment, loading } = useOrderActions();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusUpdate = async () => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return;

    const success = await updateStatus(order.id, nextStatus);
    if (success && onUpdate) {
      onUpdate();
    }
  };

  const handlePaymentToggle = async () => {
    const newStatus: PaymentStatus =
      order.paymentStatus === 'pending' ? 'paid' : 'pending';
    const success = await updatePayment(
      order.id,
      newStatus,
      newStatus === 'paid' ? 'cash' : undefined
    );
    if (success && onUpdate) {
      onUpdate();
    }
  };

  const nextStatus = getNextStatus(order.status);
  const canProgress =
    nextStatus && !['completed', 'cancelled'].includes(order.status);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">
              {order.orderNumber}
            </h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm text-gray-600">
            {order.customer.displayName} •{' '}
            {getRelativeTime(new Date(order.createdAt))}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            ¥{order.totalAmount.toLocaleString()}
          </p>
          <p
            className={`text-xs ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'}`}
          >
            {PAYMENT_STATUS_LABELS[order.paymentStatus]}
          </p>
        </div>
      </div>

      {/* 注文内容 */}
      <div className="mb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {isExpanded ? '▼ 詳細を閉じる' : '▶ 詳細を表示'}
        </button>
        {isExpanded && (
          <ul className="mt-2 space-y-1">
            {order.orderItems.map((item) => (
              <li
                key={item.id}
                className="text-sm text-gray-700 flex justify-between"
              >
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span>¥{item.subtotal.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* アクションボタン */}
      <div className="flex gap-2">
        {canProgress && (
          <button
            onClick={handleStatusUpdate}
            disabled={loading}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? '更新中...'
              : `${ORDER_STATUS_LABELS[nextStatus!]}にする`}
          </button>
        )}
        {order.status !== 'cancelled' && (
          <button
            onClick={handlePaymentToggle}
            disabled={loading}
            className={`px-4 py-2 text-sm font-semibold rounded-md border ${
              order.paymentStatus === 'paid'
                ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                : 'border-green-600 text-green-700 hover:bg-green-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {order.paymentStatus === 'paid' ? '未払いに戻す' : '支払い完了'}
          </button>
        )}
      </div>
    </div>
  );
}
