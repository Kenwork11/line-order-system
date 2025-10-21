'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import liff from '@line/liff';
import { Product, Customer } from '@/types';
import Image from 'next/image';

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID!;

export default function MenuPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = ['バーガー', 'サイド', '飲み物'];

  // ========================================
  // LIFF初期化 + 認証
  // ========================================
  useEffect(() => {
    initializeLiff();
  }, []);

  const initializeLiff = async () => {
    try {
      console.log('LIFF初期化開始...');

      // 1. LIFF初期化
      await liff.init({ liffId: LIFF_ID });
      console.log('LIFF初期化完了');

      // 2. ログイン状態チェック
      if (!liff.isLoggedIn()) {
        console.log('未ログイン → ログイン画面へ');
        liff.login();
        return;
      }

      console.log('ログイン済み');

      // 3. IDトークン取得
      const idToken = liff.getIDToken();
      if (!idToken) {
        throw new Error('IDトークンの取得に失敗しました');
      }

      console.log('IDトークン取得成功');

      // 4. サーバー側で認証
      await authenticateWithServer(idToken);
    } catch (error) {
      console.error('LIFF初期化エラー:', error);
      setError('LIFFの初期化に失敗しました');
      setLoading(false);
    }
  };

  const authenticateWithServer = async (idToken: string) => {
    try {
      console.log('サーバー認証開始...');

      const response = await fetch('/api/auth/liff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '認証に失敗しました');
      }

      const customerData = await response.json();
      console.log('認証成功:', customerData);

      setCustomer(customerData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('サーバー認証エラー:', error);
      setError('認証に失敗しました');
      setLoading(false);
    }
  };

  // ========================================
  // 商品取得
  // ========================================
  const fetchProducts = useCallback(async () => {
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
  }, [selectedCategory]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [selectedCategory, isAuthenticated, fetchProducts]);

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  // ========================================
  // ログアウト
  // ========================================
  const handleLogout = () => {
    if (liff.isLoggedIn()) {
      liff.logout();
      window.location.reload();
    }
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
              onClick={handleLogout}
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
