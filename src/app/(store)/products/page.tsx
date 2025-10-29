'use client';

import DashboardPageLayout from '@/components/store/DashboardPageLayout';
import UnderConstruction from '@/components/store/UnderConstruction';

export default function ProductsPage() {
  return (
    <DashboardPageLayout title="商品管理">
      <UnderConstruction
        pageName="商品管理"
        description="このページは現在実装中です。商品の登録、編集、削除、在庫管理機能が追加される予定です。"
      />
    </DashboardPageLayout>
  );
}
