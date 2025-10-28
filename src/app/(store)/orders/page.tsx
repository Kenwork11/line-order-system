'use client';

import DashboardPageLayout from '@/components/store/DashboardPageLayout';
import UnderConstruction from '@/components/store/UnderConstruction';

export default function OrdersPage() {
  return (
    <DashboardPageLayout title="注文管理">
      <UnderConstruction
        pageName="注文管理"
        description="このページは現在実装中です。注文の一覧、詳細、ステータス管理機能が追加される予定です。"
      />
    </DashboardPageLayout>
  );
}
