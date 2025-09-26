'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = ['バーガー', 'サイド', '飲み物'];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = selectedCategory
        ? `/api/products?category=${encodeURIComponent(selectedCategory)}`
        : '/api/products';
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('商品の取得に失敗しました');
      }

      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '予期しないエラーが発生しました'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">商品を読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 text-lg">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              再試行
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🍔 ハンバーガーショップメニュー
          </h1>
          <p className="text-lg text-gray-600">
            新鮮な食材で作った美味しいハンバーガーをお楽しみください
          </p>
        </div>

        {/* カテゴリフィルター */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === ''
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              すべて
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 商品一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* 商品画像 */}
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">画像なし</span>
                  </div>
                )}
              </div>

              {/* 商品情報 */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  {product.category && (
                    <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                      {product.category}
                    </span>
                  )}
                </div>

                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-indigo-600">
                    {formatPrice(product.price)}
                  </span>
                  <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors">
                    カートに追加
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {selectedCategory
                ? `${selectedCategory}カテゴリの商品はありません`
                : '商品がありません'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
