'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store';

export const useAuth = () => {
  const { user, setUser, setLoading, logout } = useUserStore();
  const router = useRouter();

  // 認証状態の監視
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);

      try {
        // 現在のセッションを確認
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Session check error:', error);
          logout();
          return;
        }

        if (session?.user) {
          // データベースからユーザー情報を取得（IDを使用）
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError || !userData) {
            // プロフィールが見つからない場合、基本情報を使用
            const basicUserData = {
              id: session.user.id,
              email: session.user.email || '',
              name:
                session.user.user_metadata?.name ||
                session.user.email?.split('@')[0] ||
                'ユーザー',
              avatar: session.user.user_metadata?.avatar_url || null,
              createdAt: new Date(session.user.created_at),
              updatedAt: new Date(),
            };

            setUser(basicUserData);
            return;
          }

          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            avatar: userData.avatar,
            createdAt: new Date(userData.created_at),
            updatedAt: new Date(userData.updated_at),
          });
        } else {
          logout();
        }
      } catch (error) {
        console.error('Auth check error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        logout();
        router.push('/login');
      } else if (event === 'SIGNED_IN' && session?.user) {
        // ログイン時はログインページで処理するので、ここでは何もしない
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setLoading, logout, router]);

  // ログアウト処理
  const handleLogout = async () => {
    setLoading(true);

    try {
      await supabase.auth.signOut();
      logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 認証が必要なページでの認証チェック
  const requireAuth = () => {
    if (!user) {
      router.push('/login');
      return false;
    }
    return true;
  };

  return {
    user,
    isAuthenticated: !!user,
    logout: handleLogout,
    requireAuth,
  };
};
