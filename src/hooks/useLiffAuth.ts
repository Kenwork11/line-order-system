import { useState, useEffect } from 'react';
import liff from '@line/liff';
import { Customer } from '@/types';

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID!;

/**
 * LIFF認証を管理するカスタムフック
 *
 * @returns {Object} 認証状態と顧客情報
 * @returns {boolean} isAuthenticated - 認証済みかどうか
 * @returns {Customer | null} customer - 認証済み顧客情報
 * @returns {boolean} loading - 認証処理中かどうか
 * @returns {string | null} error - エラーメッセージ
 * @returns {Function} logout - ログアウト関数
 */
export const useLiffAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeLiff();
  }, []);

  /**
   * LIFFの初期化と認証処理
   */
  const initializeLiff = async () => {
    try {
      console.log('LIFF初期化開始...');

      // LIFF SDKの初期化
      await liff.init({ liffId: LIFF_ID });
      console.log('LIFF初期化完了');

      // ログイン状態の確認
      const isLoggedIn = liff.isLoggedIn();
      if (!isLoggedIn) {
        console.log('未ログイン → ログイン画面へ');
        liff.login();
        return;
      }

      console.log('ログイン済み');

      // IDトークンの取得
      const idToken = liff.getIDToken();
      if (!idToken) {
        const tokenError = 'IDトークンの取得に失敗しました';
        throw new Error(tokenError);
      }

      console.log('IDトークン取得成功');

      // サーバー側で認証処理
      await authenticateWithServer(idToken);
    } catch (err) {
      console.error('LIFF初期化エラー:', err);
      const errorMessage = 'LIFFの初期化に失敗しました';
      setError(errorMessage);
      setLoading(false);
    }
  };

  /**
   * サーバー側での認証とセッション確立
   */
  const authenticateWithServer = async (idToken: string) => {
    try {
      console.log('サーバー認証開始...');

      // 認証APIリクエストボディ
      const authRequest = { idToken };

      const response = await fetch('/api/auth/liff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authRequest),
      });

      // レスポンスの検証
      const isSuccess = response.ok;
      if (!isSuccess) {
        const errorData = await response.json();
        const errorMessage = errorData.error || '認証に失敗しました';
        throw new Error(errorMessage);
      }

      // 認証成功: 顧客データの取得
      const customerData = await response.json();
      console.log('認証成功:', customerData);

      setCustomer(customerData);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('サーバー認証エラー:', err);
      const errorMessage = '認証に失敗しました';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ログアウト処理
   */
  const logout = () => {
    const isLoggedIn = liff.isLoggedIn();
    if (isLoggedIn) {
      liff.logout();
      window.location.reload();
    }
  };

  return {
    isAuthenticated,
    customer,
    loading,
    error,
    logout,
  };
};
