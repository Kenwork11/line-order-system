import { useState } from 'react';

/**
 * カート操作を管理するカスタムフック
 *
 * @returns {Object} カート操作に関する状態と関数
 * @returns {string | null} addingToCart - カートに追加中の商品ID
 * @returns {Function} handleAddToCart - カート追加処理
 */
export const useCart = () => {
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

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

  return {
    addingToCart,
    handleAddToCart,
  };
};
