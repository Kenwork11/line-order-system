import type { OrderStatus } from '@/types/order';
import { ORDER_STATUS_LABELS } from '@/types/order';

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusColorConfig: Record<OrderStatus, string> = {
  pending: 'bg-gray-100 text-gray-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-yellow-100 text-yellow-800',
  ready: 'bg-green-100 text-green-800',
  completed: 'bg-green-900 text-white',
  cancelled: 'bg-red-100 text-red-800',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const label = ORDER_STATUS_LABELS[status];
  const colorClass = statusColorConfig[status];

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}
    >
      {label}
    </span>
  );
}
