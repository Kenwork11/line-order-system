'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useAppStore } from '@/store';
import Sidebar from '@/components/store/Sidebar';
import { ReactNode } from 'react';

interface DashboardPageLayoutProps {
  title: string;
  children: ReactNode;
}

/**
 * ダッシュボードページの共通レイアウト
 * 認証ガード、サイドバー、ヘッダーを含む
 */
export default function DashboardPageLayout({
  title,
  children,
}: DashboardPageLayoutProps) {
  const { user } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  // 認証チェック
  const { canAccess, isLoading } = useAuthGuard({ requireAuth: true });

  // 認証チェック中またはローディング中
  if (!canAccess || isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="lg:ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <h1 className="ml-2 text-2xl font-semibold text-gray-900">
                {title}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                こんにちは、{user.name}さん
              </span>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
