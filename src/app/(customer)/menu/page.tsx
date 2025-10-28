'use client';

import Image from 'next/image';
import { useLiffAuth } from '@/hooks/useLiffAuth';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';

export default function MenuPage() {
  // カスタムフックで状態管理とロジックを分離
  const {
    isAuthenticated,
    customer,
    loading: authLoading,
    error: authError,
    logout,
  } = useLiffAuth();
  const {
    products,
    loading: productsLoading,
    error: productsError,
    selectedCategory,
    setSelectedCategory,
  } = useProducts(isAuthenticated);
  const { addingToCart, handleAddToCart } = useCart();

  // カテゴリ一覧
  const categories = ['バーガー', 'サイド', '飲み物'];

  // エラーとローディングの統合
  const error = authError || productsError;
  const loading = authLoading || productsLoading;

  // 価格フォーマット用のヘルパー関数
  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  // ========================================
  // エラー表示
  // ========================================
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">エラー</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  // ========================================
  // ローディング表示
  // ========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">認証中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー（顧客情報） */}
        {customer && (
          <div className="mb-6 flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-3">
              {customer.pictureUrl && (
                <Image
                  src={customer.pictureUrl}
                  alt={customer.displayName}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-green-500"
                />
              )}
              <div>
                <p className="text-sm text-gray-500">ようこそ</p>
                <p className="text-base font-semibold text-gray-900">
                  {customer.displayName}さん
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ログアウト
            </button>
          </div>
        )}

        {/* タイトル */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🍔 ハンバーガーショップメニュー
          </h1>
          <p className="text-gray-600">お好きな商品をお選びください</p>
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
              <div className="relative w-full h-48 bg-gray-200">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
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
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={addingToCart === product.id}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {addingToCart === product.id ? '追加中...' : 'カートに追加'}
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
