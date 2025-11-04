import type { OrderStatus } from '@/types/order';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({
  status,
  className = '',
}: OrderStatusBadgeProps) {
  const label = ORDER_STATUS_LABELS[status];
  const color = ORDER_STATUS_COLORS[status];

  const colorClasses: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-800 border-gray-300',
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    green: 'bg-green-100 text-green-800 border-green-300',
    slate: 'bg-slate-100 text-slate-600 border-slate-300',
    red: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colorClasses[color]} ${className}`}
    >
      {label}
    </span>
  );
}
