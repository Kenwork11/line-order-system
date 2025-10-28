'use client';

import DashboardPageLayout from '@/components/store/DashboardPageLayout';
import UnderConstruction from '@/components/store/UnderConstruction';

export default function AnalyticsPage() {
  return (
    <DashboardPageLayout title="レポート">
      <UnderConstruction
        pageName="レポート"
        description="このページは現在実装中です。売上分析、人気商品、顧客統計などのレポート機能が追加される予定です。"
      />
    </DashboardPageLayout>
  );
}
