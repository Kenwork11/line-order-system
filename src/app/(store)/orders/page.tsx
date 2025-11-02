'use client';

import { useState } from 'react';
import DashboardPageLayout from '@/components/store/DashboardPageLayout';
import { useOrders } from '@/hooks/useOrders';
import { OrderCard } from '@/components/store/OrderCard';
import type { OrderStatus } from '@/types/order';
import { ORDER_STATUS_LABELS } from '@/types/order';

const STATUS_FILTERS: (OrderStatus | 'all')[] = [
  'all',
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'completed',
  'cancelled',
];

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const { orders, loading, error, refetch } = useOrders({
    statusFilter: statusFilter === 'all' ? undefined : statusFilter,
  });

  return (
    <DashboardPageLayout title="注文管理">
      {/* ステータスフィルタ */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter === 'all' ? '全て' : ORDER_STATUS_LABELS[filter]}
            </button>
          ))}
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* ローディング表示 */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      )}

      {/* 注文一覧 */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">注文がありません</p>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onUpdate={refetch} />
          ))}
        </div>
      )}

      {/* リアルタイム更新のインジケーター */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>リアルタイム更新中</span>
      </div>
    </DashboardPageLayout>
  );
}
