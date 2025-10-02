'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    supabaseUser: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const fetchUserProfile = useCallback(
    async (supabaseUser: SupabaseUser): Promise<User | null> => {
      try {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);

          // データベースエラーの場合は基本情報で返す
          if (error.code !== 'PGRST116') {
            console.warn(
              'Database access error, using basic user info from auth'
            );
            return {
              id: supabaseUser.id,
              email: supabaseUser.email || '',
              name:
                supabaseUser.user_metadata?.name ||
                supabaseUser.email?.split('@')[0] ||
                'ユーザー',
              avatar: supabaseUser.user_metadata?.avatar_url || null,
              createdAt: new Date(supabaseUser.created_at),
              updatedAt: new Date(),
            };
          }
        }

        if (!userData) {
          // プロフィールが存在しない場合、データベーストリガーによる自動作成を待つ
          // 少し待ってから再度取得を試みる
          await new Promise((resolve) => setTimeout(resolve, 100));

          const { data: retryData, error: retryError } = await supabase
            .from('users')
            .select('*')
            .eq('id', supabaseUser.id)
            .single();

          if (retryError || !retryData) {
            // それでも見つからない場合は基本情報で返す
            console.warn(
              'User profile not found even after retry, returning basic info'
            );
            return {
              id: supabaseUser.id,
              email: supabaseUser.email || '',
              name:
                supabaseUser.user_metadata?.name ||
                supabaseUser.email?.split('@')[0] ||
                'ユーザー',
              avatar: supabaseUser.user_metadata?.avatar_url || null,
              createdAt: new Date(supabaseUser.created_at),
              updatedAt: new Date(),
            };
          }

          return {
            id: retryData.id,
            email: retryData.email,
            name: retryData.name,
            avatar: retryData.avatar,
            createdAt: new Date(retryData.created_at),
            updatedAt: new Date(retryData.updated_at),
          };
        }

        return {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          createdAt: new Date(userData.created_at),
          updatedAt: new Date(userData.updated_at),
        };
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
        return null;
      }
    },
    []
  );

  const refreshUser = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user);
        setState((prev) => ({
          ...prev,
          user: userProfile,
          supabaseUser: session.user,
          isAuthenticated: true,
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          user: null,
          supabaseUser: null,
          isAuthenticated: false,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setState((prev) => ({
        ...prev,
        user: null,
        supabaseUser: null,
        isAuthenticated: false,
        isLoading: false,
      }));
    }
  }, [fetchUserProfile]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setState((prev) => ({ ...prev, isLoading: false }));
          return { error: error.message };
        }

        if (data.user) {
          const userProfile = await fetchUserProfile(data.user);
          setState((prev) => ({
            ...prev,
            user: userProfile,
            supabaseUser: data.user,
            isAuthenticated: true,
            isLoading: false,
          }));
        }

        return {};
      } catch (err) {
        console.error('Sign in error:', err);
        setState((prev) => ({ ...prev, isLoading: false }));
        return { error: 'ログイン処理中にエラーが発生しました' };
      }
    },
    [fetchUserProfile]
  );

  const signOut = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
      }

      setState({
        user: null,
        supabaseUser: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error during sign out:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // 初回認証状態チェック
    refreshUser();

    // 認証状態変更の監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setState({
          user: null,
          supabaseUser: null,
          isAuthenticated: false,
          isLoading: false,
        });
      } else if (event === 'SIGNED_IN' && session?.user) {
        const userProfile = await fetchUserProfile(session.user);
        setState({
          user: userProfile,
          supabaseUser: session.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        const userProfile = await fetchUserProfile(session.user);
        setState((prev) => ({
          ...prev,
          user: userProfile,
          supabaseUser: session.user,
          isAuthenticated: true,
        }));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, refreshUser]);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signIn,
      signOut,
      refreshUser,
    }),
    [state, signIn, signOut, refreshUser]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
