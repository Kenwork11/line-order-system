'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useAppStore } from '@/store';
import Sidebar from '@/components/store/Sidebar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  // 認証チェック
  const { canAccess, isLoading } = useAuthGuard({ requireAuth: true });

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
                レポート
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                こんにちは、{user.name}さん
              </span>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Card>
            <CardHeader>
              <CardTitle>レポート</CardTitle>
              <CardDescription>
                このページは現在実装中です。売上分析、人気商品、顧客統計などのレポート機能が追加される予定です。
              </CardDescription>
            </CardHeader>
            <div className="p-6 pt-0">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex items-center">
                  <div className="text-yellow-400 mr-3">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">
                      🚧 実装予定
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      レポート機能は現在開発中です。しばらくお待ちください。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
