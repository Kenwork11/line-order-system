import { useState, useEffect, useCallback } from 'react';

type CartItem = {
  id: string;
  productId: string;
  productName: string;
  productDescription: string | null;
  productImageUrl: string | null;
  productCategory: string | null;
  price: number;
  quantity: number;
  subtotal: number;
};

/**
 * カート操作を管理するカスタムフック
 *
 * @param {boolean} isAuthenticated - 認証済みかどうか
 * @returns {Object} カート操作に関する状態と関数
 * @returns {string | null} addingToCart - カートに追加中の商品ID
 * @returns {CartItem[]} cartItems - カート内の商品一覧
 * @returns {number} cartItemCount - カート内のアイテム数
 * @returns {boolean} loading - カート情報読み込み中かどうか
 * @returns {Function} handleAddToCart - カート追加処理
 * @returns {Function} refreshCart - カート情報を再取得
 */
export const useCart = (isAuthenticated: boolean) => {
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * カート情報を取得（商品一覧とアイテム数）
   */
  const fetchCartCount = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await fetch('/api/cart');

      if (!response.ok) {
        throw new Error('カート情報の取得に失敗しました');
      }

      const data = await response.json();
      setCartItems(data.items || []);
      setCartItemCount(data.itemCount || 0);
    } catch (err) {
      console.error('カート取得エラー:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // 認証後にカート情報を取得
  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  /**
   * カートに商品を追加する
   *
   * @param {string} productId - 追加する商品のID
   */
  const handleAddToCart = async (productId: string) => {
    // ローディング状態を設定
    setAddingToCart(productId);

    try {
      // カートに追加するリクエストボディを構築
      const addToCartRequest = {
        productId,
        quantity: 1,
      };

      // API呼び出し
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addToCartRequest),
      });

      // レスポンスの検証
      const isSuccess = response.ok;
      if (!isSuccess) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'カートへの追加に失敗しました';
        throw new Error(errorMessage);
      }

      // 成功データの取得
      const cartItem = await response.json();
      const productName = cartItem.productName || '商品';
      const successMessage = `${productName}をカートに追加しました`;

      // 成功フィードバック
      alert(successMessage);

      // カート情報を再取得
      await fetchCartCount();
    } catch (err) {
      console.error('カート追加エラー:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'カートへの追加に失敗しました';
      alert(errorMessage);
    } finally {
      // ローディング状態をリセット
      setAddingToCart(null);
    }
  };

  /**
   * カートアイテムの数量を更新する
   *
   * @param {string} cartItemId - 更新するカートアイテムのID
   * @param {number} newQuantity - 新しい数量
   */
  const handleUpdateQuantity = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    // 楽観的UI更新
    const previousCartItems = [...cartItems];
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === cartItemId
            ? {
                ...item,
                quantity: newQuantity,
                subtotal: item.price * newQuantity,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('数量更新に失敗しました');
      }

      const data = await response.json();

      if (data.deleted) {
        // 削除された場合はカートから除外
        setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
        setCartItemCount((prev) => prev - 1);
      } else {
        // 更新された場合はレスポンスのデータで更新
        setCartItems((prev) =>
          prev.map((item) => (item.id === cartItemId ? data : item))
        );
      }
    } catch (err) {
      console.error('数量更新エラー:', err);
      // エラー時は元に戻す
      setCartItems(previousCartItems);
      alert('数量の更新に失敗しました');
    }
  };

  return {
    addingToCart,
    cartItems,
    cartItemCount,
    loading,
    handleAddToCart,
    handleUpdateQuantity,
    refreshCart: fetchCartCount,
  };
};
