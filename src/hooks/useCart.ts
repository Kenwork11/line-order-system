import { useState, useEffect, useCallback } from 'react';
import { useCartStore } from '@/store/cartStore';

/**
 * トースト通知の状態管理用の型定義
 */
interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

/**
 * カート操作を管理するカスタムフック
 * - Zustandストアを使用してフロントエンドのみで数量変更を管理
 * - localStorageで永続化
 * - サーバーからの初期データ取得とマージ処理
 *
 * @param {boolean} isAuthenticated - 認証済みかどうか
 * @returns {Object} カート操作に関する状態と関数
 */
export const useCart = (isAuthenticated: boolean) => {
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'info',
  });
  const {
    items: cartItems,
    loading,
    setItems,
    updateQuantity,
    setLoading,
    getItemCount,
  } = useCartStore();

  /**
   * サーバーからカート情報を取得し、localStorageの状態とマージ
   */
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await fetch('/api/cart');

      if (!response.ok) {
        throw new Error('カート情報の取得に失敗しました');
      }

      const data = await response.json();
      const serverItems = data.items || [];

      // サーバーから取得したデータでストアを更新
      // localStorageに既に変更があった場合は、それを優先する設計も可能
      // 今回はサーバーデータを基準とし、localStorageは数量変更のみに使用
      setItems(serverItems);
    } catch (err) {
      console.error('カート取得エラー:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, setItems, setLoading]);

  // 認証後にサーバーからカート情報を取得
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /**
   * カートに商品を追加する
   * 商品追加はサーバーに送信（在庫確認・価格検証のため）
   *
   * @param {string} productId - 追加する商品のID
   */
  const handleAddToCart = async (productId: string) => {
    setAddingToCart(productId);

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'カートへの追加に失敗しました');
      }

      const cartItem = await response.json();
      setToast({
        show: true,
        message: `${cartItem.productName || '商品'}をカートに追加しました`,
        type: 'success',
      });

      // サーバーから最新のカート情報を再取得
      await fetchCart();
    } catch (err) {
      console.error('カート追加エラー:', err);
      setToast({
        show: true,
        message:
          err instanceof Error ? err.message : 'カートへの追加に失敗しました',
        type: 'error',
      });
    } finally {
      setAddingToCart(null);
    }
  };

  /**
   * カートアイテムの数量を更新する（フロントエンドのみ）
   * - サーバーには送信しない
   * - 数量0で削除
   * - localStorageに自動保存
   *
   * @param {string} cartItemId - 更新するカートアイテムのID
   * @param {number} newQuantity - 新しい数量
   */
  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    updateQuantity(cartItemId, newQuantity);
  };

  return {
    addingToCart,
    cartItems,
    cartItemCount: getItemCount(),
    loading,
    handleAddToCart,
    handleUpdateQuantity,
    refreshCart: fetchCart,
    toast,
    closeToast: () => setToast({ show: false, message: '', type: 'info' }),
  };
};
