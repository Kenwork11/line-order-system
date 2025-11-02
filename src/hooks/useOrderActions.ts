import { useState } from 'react';
import type { OrderStatus, PaymentStatus } from '@/types/order';

interface UseOrderActionsReturn {
  updateStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  updatePayment: (
    orderId: string,
    paymentStatus: PaymentStatus,
    paymentMethod?: string
  ) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useOrderActions(): UseOrderActionsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (
    orderId: string,
    status: OrderStatus
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'ステータスの更新に失敗しました');
      }

      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '不明なエラーが発生しました';
      setError(message);
      console.error('Failed to update order status:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePayment = async (
    orderId: string,
    paymentStatus: PaymentStatus,
    paymentMethod?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_status: paymentStatus,
          payment_method: paymentMethod,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '支払いステータスの更新に失敗しました');
      }

      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '不明なエラーが発生しました';
      setError(message);
      console.error('Failed to update payment status:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateStatus,
    updatePayment,
    loading,
    error,
  };
}
