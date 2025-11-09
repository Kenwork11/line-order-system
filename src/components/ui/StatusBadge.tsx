interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: '注文確認中',
    className: 'bg-gray-100 text-gray-800',
  },
  confirmed: {
    label: '確認済み',
    className: 'bg-blue-100 text-blue-800',
  },
  preparing: {
    label: '準備中',
    className: 'bg-yellow-100 text-yellow-800',
  },
  ready: {
    label: '受取可能',
    className: 'bg-green-100 text-green-800',
  },
  completed: {
    label: '完了',
    className: 'bg-green-900 text-white',
  },
  cancelled: {
    label: 'キャンセル',
    className: 'bg-red-100 text-red-800',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${config.className}`}
    >
      {config.label}
    </span>
  );
}
