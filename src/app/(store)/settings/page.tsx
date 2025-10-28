'use client';

import DashboardPageLayout from '@/components/store/DashboardPageLayout';
import UnderConstruction from '@/components/store/UnderConstruction';

export default function SettingsPage() {
  return (
    <DashboardPageLayout title="設定">
      <UnderConstruction
        pageName="設定"
        description="このページは現在実装中です。店舗情報、通知設定、アカウント設定などの機能が追加される予定です。"
      />
    </DashboardPageLayout>
  );
}
