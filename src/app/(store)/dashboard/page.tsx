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
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const { user } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  // 認証チェック - ミドルウェアでも保護されているが、追加のチェック
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

  // ダミーの統計データ
  const stats = [
    {
      id: 'today-orders',
      title: '本日の注文',
      value: '24',
      change: '+12%',
      icon: '📋',
    },
    {
      id: 'total-revenue',
      title: '売上高',
      value: '¥45,678',
      change: '+5.2%',
      icon: '💰',
    },
    {
      id: 'pending-orders',
      title: '処理待ち',
      value: '8',
      change: '-3',
      icon: '⏳',
    },
    {
      id: 'completed-orders',
      title: '完了済み',
      value: '156',
      change: '+23',
      icon: '✅',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* サイドバー */}
      <Sidebar />

      {/* メインコンテンツエリア */}
      <div className="lg:ml-64">
        {/* トップヘッダー */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              {/* モバイル用メニューボタン */}
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
                ダッシュボード
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                こんにちは、{user.name}さん
              </span>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* ウェルカムセクション */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              おかえりなさい！
            </h2>
            <p className="text-gray-600">
              注文管理システムへようこそ。本日の業務概要を確認できます。
            </p>
          </div>

          {/* 統計カードグリッド */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardDescription className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </CardDescription>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </CardTitle>
                    </div>
                    <div className="text-2xl">{stat.icon}</div>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`text-sm font-medium ${
                        stat.change.startsWith('+')
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">前日比</span>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* クイックアクションセクション */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>最近の注文</CardTitle>
                <CardDescription>直近の注文状況を確認できます</CardDescription>
              </CardHeader>
              <div className="p-6 pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">#12345</p>
                      <p className="text-sm text-gray-500">田中様の注文</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                      調理中
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">#12344</p>
                      <p className="text-sm text-gray-500">佐藤様の注文</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      完了
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">#12343</p>
                      <p className="text-sm text-gray-500">山田様の注文</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      受注
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    すべての注文を見る
                  </Button>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>クイックアクション</CardTitle>
                <CardDescription>
                  よく使用する機能に素早くアクセス
                </CardDescription>
              </CardHeader>
              <div className="p-6 pt-0">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex-col">
                    <span className="text-lg mb-1">📋</span>
                    <span className="text-sm">新規注文</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <span className="text-lg mb-1">🛍️</span>
                    <span className="text-sm">商品管理</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <span className="text-lg mb-1">👥</span>
                    <span className="text-sm">顧客管理</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <span className="text-lg mb-1">📈</span>
                    <span className="text-sm">レポート</span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* 追加情報エリア */}
          <Card>
            <CardHeader>
              <CardTitle>システム情報</CardTitle>
              <CardDescription>現在のシステム状態とお知らせ</CardDescription>
            </CardHeader>
            <div className="p-6 pt-0">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-center">
                  <div className="text-blue-400 mr-3">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">
                      注文管理システム
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      システムは正常に動作しています。本日の注文処理は順調に進んでいます。
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
