'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store';
import Button from '@/components/ui/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, setLoading, setError, isLoading, error } = useUserStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Supabase Authでログイン
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        setError('ログインに失敗しました: ' + authError.message);
        return;
      }

      if (authData.user) {
        // データベースからユーザー情報を取得（IDを使用）
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (userError || !userData) {
          // プロフィールが見つからない場合、基本情報で作成
          const basicUserData = {
            id: authData.user.id,
            email: authData.user.email || '',
            name:
              authData.user.user_metadata?.name ||
              authData.user.email?.split('@')[0] ||
              'ユーザー',
            avatar: authData.user.user_metadata?.avatar_url || null,
            createdAt: new Date(authData.user.created_at),
            updatedAt: new Date(),
          };

          setUser(basicUserData);
          router.push('/dashboard');
          return;
        }

        // ストアにユーザー情報を保存
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          createdAt: new Date(userData.created_at),
          updatedAt: new Date(userData.updated_at),
        });

        // ダッシュボードにリダイレクト
        router.push('/dashboard');
      }
    } catch (err) {
      setError('ログイン処理中にエラーが発生しました');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            注文管理システム
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            管理者アカウントでログインしてください
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ログイン</CardTitle>
            <CardDescription>
              認証情報を入力してシステムにアクセスしてください
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin} className="space-y-6 p-6 pt-0">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="your@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="パスワード"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
