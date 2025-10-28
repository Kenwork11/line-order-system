'use client';

import { useAppStore } from '@/store';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const { signOut, user } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'ダッシュボード',
      icon: '📊',
      href: '/dashboard',
    },
    {
      id: 'orders',
      label: '注文管理',
      icon: '📋',
      href: '/orders',
    },
    {
      id: 'products',
      label: '商品管理',
      icon: '🛍️',
      href: '/products',
    },
    {
      id: 'customers',
      label: '顧客管理',
      icon: '👥',
      href: '/customers',
    },
    {
      id: 'analytics',
      label: 'レポート',
      icon: '📈',
      href: '/analytics',
    },
    {
      id: 'settings',
      label: '設定',
      icon: '⚙️',
      href: '/settings',
    },
  ];

  return (
    <>
      {/* モバイル用オーバーレイ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* サイドバー */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* ヘッダー */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                注文管理システム
              </h1>
            </div>

            {/* モバイル用閉じるボタン */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Close sidebar</span>✕
            </button>
          </div>

          {/* ユーザー情報 */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'ユーザー'}
                </p>
                <p className="text-xs text-gray-500">{user?.email || ''}</p>
              </div>
            </div>
          </div>

          {/* メニューリスト */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* ログアウトボタン */}
          <div className="px-4 py-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="w-full"
            >
              ログアウト
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
