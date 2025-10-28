'use client';

import DashboardPageLayout from '@/components/store/DashboardPageLayout';
import UnderConstruction from '@/components/store/UnderConstruction';

export default function CustomersPage() {
  return (
    <DashboardPageLayout title="顧客管理">
      <UnderConstruction
        pageName="顧客管理"
        description="このページは現在実装中です。顧客情報の閲覧、編集、注文履歴の確認機能が追加される予定です。"
      />
    </DashboardPageLayout>
  );
}
