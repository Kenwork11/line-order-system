/**
 * カート状態を管理するZustandストア
 * フロントエンドのみで数量変更を管理し、localStorageで永続化します
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * カートアイテムの型定義
 */
export type CartItem = {
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
 * カート状態のインターフェース
 */
interface CartState {
  items: CartItem[];
  loading: boolean;
}

/**
 * カート操作のアクション
 */
interface CartActions {
  setItems: (items: CartItem[]) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  getItemCount: () => number;
  getTotalAmount: () => number;
}

/**
 * カート状態管理用のZustandストア
 * - フロントエンドのみで数量変更を管理
 * - localStorageで永続化
 * - 注文確定時にサーバーへ一括送信（別PRで実装予定）
 */
export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      // ===== 初期状態 =====
      items: [],
      loading: false,

      // ===== アクション =====

      /**
       * カートアイテムを一括設定（サーバーから取得した初期データ用）
       */
      setItems: (items) => set({ items }),

      /**
       * カートアイテムの数量を更新
       * - 数量0も許可（削除予約状態）
       * - 注文確定時に数量0のアイテムをサーバーで削除
       * - サーバーには送信せず、フロントのみで管理
       */
      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity: Math.max(0, quantity),
                  subtotal: item.price * Math.max(0, quantity),
                }
              : item
          ),
        })),

      /**
       * カートアイテムを削除
       */
      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),

      /**
       * カートを空にする
       */
      clearCart: () => set({ items: [] }),

      /**
       * ローディング状態を設定
       */
      setLoading: (loading) => set({ loading }),

      /**
       * カート内のアイテム数を取得
       */
      getItemCount: () => get().items.length,

      /**
       * カート内の合計金額を計算
       */
      getTotalAmount: () =>
        get().items.reduce((sum, item) => sum + item.subtotal, 0),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
