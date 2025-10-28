/**
 * 商品登録・編集フォームコンポーネント
 * モーダル形式で商品の新規登録と編集を行います
 */

'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import type { Product, ApiResponse } from '@/types';
import Button from '@/components/ui/Button';
import {
  PRODUCT_CATEGORIES,
  type CreateProductInput,
} from '@/lib/validations/product';

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
  isEditing: boolean;
}

/**
 * 商品フォームコンポーネント
 *
 * 機能:
 * - 商品の新規登録と編集
 * - バリデーション
 * - 送信中の状態管理
 * - エラーハンドリング
 */
export default function ProductForm({
  product,
  onSubmit,
  onCancel,
  isEditing,
}: ProductFormProps) {
  // ===== 状態管理 =====
  const [formData, setFormData] = useState<CreateProductInput>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    imageUrl: product?.imageUrl || '',
    category:
      (product?.category as (typeof PRODUCT_CATEGORIES)[number]) || null,
    isActive: product?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===== エフェクト =====
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        imageUrl: product.imageUrl || '',
        category:
          (product.category as (typeof PRODUCT_CATEGORIES)[number]) || null,
        isActive: product.isActive,
      });
    }
  }, [product]);

  // ===== イベントハンドラ =====
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'price') {
      // 数値のみを許可（先頭の0を除去）
      const numericValue = value.replace(/[^\d]/g, '');
      const parsedValue = numericValue === '' ? 0 : parseInt(numericValue, 10);
      setFormData((prev) => ({ ...prev, [name]: parsedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response: ApiResponse<Product>;

      if (isEditing && product) {
        // 商品を更新
        response = await api.put<Product>(
          `/api/products/${product.id}`,
          formData
        );
      } else {
        // 商品を新規作成
        response = await api.post<Product>('/api/products', formData);
      }

      if (response.success && response.data) {
        onSubmit(response.data);
      } else {
        setError(response.error || 'Failed to save product');
      }
    } catch (err) {
      setError('Failed to save product');
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };

  // ===== レンダリング =====
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {isEditing ? '商品を編集' : '商品を追加'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 商品名 */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                商品名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={255}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="例: チーズバーガー"
              />
            </div>

            {/* 説明 */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                説明
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                maxLength={1000}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="商品の詳細説明を入力してください"
              />
            </div>

            {/* 価格 */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                価格（円） <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                id="price"
                name="price"
                value={formData.price === 0 ? '' : formData.price}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="例: 500"
              />
            </div>

            {/* カテゴリ */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                カテゴリ
              </label>
              <select
                id="category"
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">選択してください</option>
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* 画像URL */}
            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                画像URL
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  (画像アップロード機能は準備中です)
                </span>
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* 販売状態 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                販売中
              </label>
            </div>

            {/* ボタン */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                onClick={onCancel}
                variant="secondary"
                disabled={loading}
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? '保存中...' : isEditing ? '更新' : '作成'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
