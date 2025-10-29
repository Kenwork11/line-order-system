/**
 * 商品一覧表示コンポーネント
 * APIから商品データを取得し、カード形式で表示します
 * フィルタリング、検索、CRUD操作を含みます
 */

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { api } from '@/utils/api';
import type { Product, ApiResponse } from '@/types';
import Button from '@/components/ui/Button';
import ProductForm from '@/components/store/ProductForm';
import DeleteConfirmModal from '@/components/store/DeleteConfirmModal';
import { PRODUCT_CATEGORIES } from '@/lib/validations/product';

/**
 * 商品一覧表示コンポーネント
 *
 * 機能:
 * - APIから商品データを取得
 * - カテゴリフィルタリング
 * - 検索機能
 * - 商品の追加、編集、削除
 * - 販売状態の表示
 * - レスポンシブなグリッドレイアウトで表示
 */
export default function ProductsList() {
  // ===== 状態管理 =====
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  /**
   * 商品データをAPIから取得する関数
   * 管理画面用：全商品（非販売中含む）を取得
   */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // 管理画面用APIエンドポイントを使用
      const response: ApiResponse<Product[]> = await api.get<Product[]>(
        '/api/admin/products'
      );

      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        setError(response.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  /**
   * フィルタリングと検索を適用
   */
  useEffect(() => {
    let filtered = [...products];

    // カテゴリフィルタ
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // 検索フィルタ
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
      );
    }

    // 販売状態フィルタ
    if (!showInactive) {
      filtered = filtered.filter((product) => product.isActive);
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, showInactive]);

  /**
   * コンポーネントマウント時に商品データを取得
   */
  useEffect(() => {
    fetchProducts();
  }, []);

  // ===== イベントハンドラ =====
  const handleCreateProduct = () => {
    setShowForm(true);
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setDeletingProduct(product);
  };

  const handleFormSubmit = (product: Product) => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      setProducts([product, ...products]);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDeleteConfirm = (productId: string) => {
    // DeleteConfirmModalが削除処理を行うので、ここでは状態更新のみ
    setProducts(products.filter((p) => p.id !== productId));
    setDeletingProduct(null);
  };

  const handleDeleteCancel = () => {
    setDeletingProduct(null);
  };

  // ===== ローディング状態の表示 =====
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ===== エラー状態の表示 =====
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="mb-4 text-red-600 dark:text-red-400">{error}</p>
        <Button onClick={fetchProducts}>再試行</Button>
      </div>
    );
  }

  // ===== メインコンテンツの表示 =====
  return (
    <div className="space-y-4">
      {/* ヘッダー部分 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">商品一覧</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {filteredProducts.length}件の商品
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleCreateProduct} size="sm">
            商品を追加
          </Button>
          <Button onClick={fetchProducts} size="sm" variant="secondary">
            更新
          </Button>
        </div>
      </div>

      {/* フィルタリングと検索 */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* 検索 */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              検索
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="商品名や説明で検索..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* カテゴリフィルタ */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              カテゴリ
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="all">すべて</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* 販売状態フィルタ */}
          <div className="flex items-end">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                非販売中も表示
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* 商品カードのグリッド表示 */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            商品が見つかりませんでした
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`border rounded-lg bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                !product.isActive ? 'opacity-60' : ''
              }`}
            >
              {/* 商品画像 */}
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg
                      className="w-16 h-16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                {!product.isActive && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    非販売中
                  </div>
                )}
                {product.category && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    {product.category}
                  </div>
                )}
              </div>

              {/* 商品情報 */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                  ¥{product.price.toLocaleString()}
                </p>

                {/* 操作ボタン */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleEditProduct(product)}
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                  >
                    編集
                  </Button>
                  <Button
                    onClick={() => handleDeleteProduct(product)}
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                  >
                    削除
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* モーダル表示 */}
      {showForm && (
        <ProductForm
          product={editingProduct || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isEditing={!!editingProduct}
        />
      )}

      {deletingProduct && (
        <DeleteConfirmModal
          title="商品の削除"
          itemName={deletingProduct.name}
          itemType="商品"
          apiEndpoint={`/api/products/${deletingProduct.id}`}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
}
