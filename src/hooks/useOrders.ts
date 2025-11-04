import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { OrderWithDetails, OrderStatus } from '@/types/order';

interface UseOrdersOptions {
  statusFilter?: OrderStatus;
  limit?: number;
}

interface UseOrdersReturn {
  orders: OrderWithDetails[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOrders(options: UseOrdersOptions = {}): UseOrdersReturn {
  const { statusFilter, limit = 50 } = options;
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      params.append('limit', limit.toString());

      const response = await fetch(`/api/admin/orders?${params.toString()}`);

      if (!response.ok) {
        throw new Error('注文の取得に失敗しました');
      }

      const data = await response.json();
      setOrders(data.orders);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '不明なエラーが発生しました'
      );
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Supabase Realtimeでの更新監視
  useEffect(() => {
    const channel = supabase
      .channel('admin-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload: unknown) => {
          console.log('Order change detected:', payload);
          // 変更があったら再取得
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  };
}
