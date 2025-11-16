import { useEffect } from 'react';
import dayjs from 'dayjs';
import StatusBadge from './ui/StatusBadge';
import type { OrderForUI } from '@/types/order';

interface OrderDetailModalProps {
  isOpen: boolean;
  order: OrderForUI | null;
  onClose: () => void;
}

export default function OrderDetailModal({
  isOpen,
  order,
  onClose,
}: OrderDetailModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const formatPrice = (price: number) => `¥${price.toLocaleString()}`;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                注文詳細
              </h2>
              <p className="text-sm text-gray-500">
                {dayjs(order.createdAt).format('YYYY年MM月DD日 HH:mm')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="閉じる"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-6">
          {/* 注文番号とステータス */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">注文番号</span>
              <span className="text-base font-semibold text-gray-900">
                {order.orderNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">ステータス</span>
              <StatusBadge status={order.status} />
            </div>
          </div>

          {/* 商品リスト */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              注文商品
            </h3>
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.productName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.productPrice)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 合計金額 */}
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                合計金額
              </span>
              <span className="text-2xl font-bold text-indigo-600">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
