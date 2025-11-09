import dayjs from 'dayjs';
import StatusBadge from './ui/StatusBadge';

interface OrderItem {
  id: string;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
}

interface OrderCardProps {
  order: Order;
  onClick: () => void;
}

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const formatPrice = (price: number) => `¥${price.toLocaleString()}`;
  const itemCount = order.orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            {dayjs(order.createdAt).format('YYYY年MM月DD日 HH:mm')}
          </p>
          <p className="text-base font-semibold text-gray-900">
            {order.orderNumber}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span>{itemCount}点の商品</span>
        </div>
        <div className="text-lg font-bold text-indigo-600">
          {formatPrice(order.totalAmount)}
        </div>
      </div>
    </div>
  );
}
