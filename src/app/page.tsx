'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/**
 * ルートページ
 * 認証状態に基づいて適切なページにリダイレクトします
 */
export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      // 認証済みユーザーはダッシュボードにリダイレクト
      router.push('/dashboard');
    } else if (!isAuthenticated && !user) {
      // 未認証ユーザーはログインページにリダイレクト
      router.push('/login');
    }
    // ローディング中（isAuthenticated: false, user: null）は何もしない
  }, [isAuthenticated, user, router]);

  // リダイレクト中はローディング表示
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">読み込み中...</p>
      </div>
    </div>
  );
}
