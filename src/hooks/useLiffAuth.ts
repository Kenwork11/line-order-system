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
    authenticate();
  }, []);

  /**
   * 認証処理のメインフロー
   * 1. セッション確認
   * 2. セッションが無効ならLIFFログイン
   */
  const authenticate = async () => {
    try {
      console.log('認証開始...');

      // まずセッション確認を試行
      const sessionValid = await checkSession();
      if (sessionValid) {
        console.log('セッション認証成功');
        return;
      }

      console.log('セッション無効 → LIFF認証開始');

      // セッションが無効な場合、LIFF認証を実行
      await initializeLiff();
    } catch (err) {
      console.error('認証エラー:', err);
      const errorMessage = '認証処理に失敗しました';
      setError(errorMessage);
      setLoading(false);
    }
  };

  /**
   * セッション確認
   * Cookie内のセッションが有効かチェック
   */
  const checkSession = async (): Promise<boolean> => {
    try {
      console.log('セッション確認中...');

      const response = await fetch('/api/auth/liff', {
        method: 'GET',
        credentials: 'include', // Cookieを含める
      });

      if (response.ok) {
        const customerData = await response.json();
        console.log('セッション有効:', customerData);

        setCustomer(customerData);
        setIsAuthenticated(true);
        setLoading(false);
        return true;
      }

      console.log('セッション無効:', response.status);
      return false;
    } catch (err) {
      console.error('セッション確認エラー:', err);
      return false;
    }
  };

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
        console.error('IDトークンの取得に失敗 → 再ログイン');
        // IDトークンが取得できない場合は再ログイン
        liff.logout();
        liff.login();
        return;
      }

      console.log('IDトークン取得成功');

      // サーバー側で認証処理（IDトークン検証 & セッション作成）
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
  const logout = async () => {
    try {
      console.log('ログアウト開始...');

      // サーバー側のセッションを削除
      await fetch('/api/auth/liff', {
        method: 'DELETE',
        credentials: 'include',
      });

      console.log('セッション削除完了');

      // LIFF側のログアウト
      if (liff.isLoggedIn()) {
        liff.logout();
      }

      // ページをリロードして初期状態に戻す
      window.location.reload();
    } catch (err) {
      console.error('ログアウトエラー:', err);
      // エラーが発生してもログアウトを試行
      if (liff.isLoggedIn()) {
        liff.logout();
      }
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
