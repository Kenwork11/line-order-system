'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLiffAuth } from '@/hooks/useLiffAuth';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { isAuthenticated, customer, error: authError, logout } = useLiffAuth();
  const { cartItems, handleUpdateQuantity } = useCart(isAuthenticated);

  // エラー表示用の統合
  const error = authError;

  // 価格フォーマット用のヘルパー関数
  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  // 合計金額を計算
  const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🛒 カート</h1>
          <p className="text-gray-600">
            {cartItems.length}個の商品が入っています
          </p>
        </div>

        {/* カートが空の場合 */}
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              カートは空です
            </h2>
            <p className="text-gray-600 mb-6">
              メニューから商品を追加してください
            </p>
            <Link
              href="/menu"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              メニューを見る
            </Link>
          </div>
        ) : (
          <>
            {/* カート商品一覧 */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-4 flex items-center gap-4 ${
                    index !== cartItems.length - 1
                      ? 'border-b border-gray-200'
                      : ''
                  } ${item.quantity === 0 ? 'opacity-50 bg-gray-50' : ''}`}
                >
                  {/* 商品画像 */}
                  <div className="relative w-20 h-20 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                    {item.productImageUrl ? (
                      <Image
                        src={item.productImageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-xs">画像なし</span>
                      </div>
                    )}
                  </div>

                  {/* 商品情報 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.productName}
                    </h3>
                    {item.productCategory && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full mb-2">
                        {item.productCategory}
                      </span>
                    )}
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">
                        {formatPrice(item.price)}
                      </span>
                      {/* 数量変更ボタン */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                          aria-label="数量を減らす"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                          aria-label="数量を増やす"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 小計 */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-indigo-600">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 合計金額 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">小計</span>
                <span className="text-lg">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xl font-bold text-gray-900">合計</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex flex-col gap-3">
              <button
                className="w-full py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                disabled
              >
                注文を確定する（未実装）
              </button>
              <Link
                href="/menu"
                className="w-full py-4 bg-white text-indigo-600 text-lg font-semibold rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors text-center"
              >
                メニューに戻る
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
