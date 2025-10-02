'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * 認証ガードフック
 * ページレベルでの認証チェックを行います
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { redirectTo = '/login', requireAuth = true } = options;
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
    } else if (!requireAuth && isAuthenticated) {
      // ログインページにいるが既に認証済みの場合
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  return {
    isAuthenticated,
    isLoading,
    canAccess: requireAuth ? isAuthenticated : true,
  };
}
