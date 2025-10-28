import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';

/**
 * 商品データの取得とフィルタリングを管理するカスタムフック
 *
 * @param {boolean} isAuthenticated - 認証済みかどうか
 * @returns {Object} 商品データと関連する状態
 * @returns {Product[]} products - 商品一覧
 * @returns {boolean} loading - 読み込み中かどうか
 * @returns {string | null} error - エラーメッセージ
 * @returns {string} selectedCategory - 選択中のカテゴリ
 * @returns {Function} setSelectedCategory - カテゴリ選択関数
 */
export const useProducts = (isAuthenticated: boolean) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  /**
   * 商品データの取得
   */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      // APIエンドポイントURLの構築
      const baseUrl = '/api/products';
      const categoryParam = selectedCategory
        ? `?category=${encodeURIComponent(selectedCategory)}`
        : '';
      const url = `${baseUrl}${categoryParam}`;

      // 商品データの取得
      const response = await fetch(url);

      // レスポンスの検証
      const isSuccess = response.ok;
      if (!isSuccess) {
        const errorMessage = '商品の取得に失敗しました';
        throw new Error(errorMessage);
      }

      // 商品データの設定
      const productsData = await response.json();
      setProducts(productsData);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '予期しないエラーが発生しました';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  // 認証後に商品を取得
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [selectedCategory, isAuthenticated, fetchProducts]);

  return {
    products,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
  };
};
