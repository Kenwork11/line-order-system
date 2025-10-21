/**
 * アプリケーション全体で使用される共通の型定義
 * データ構造の一貫性を保つために定義されています
 */

/**
 * ユーザー情報を表すインターフェース
 * 認証やプロフィール表示などで使用されます
 */
export interface User {
  id: string; // ユーザーの一意識別子
  email: string; // メールアドレス
  name: string; // 表示名
  avatar?: string; // プロフィール画像URL（オプション）
  createdAt: Date; // 作成日時
  updatedAt: Date; // 最終更新日時
}

/**
 * API レスポンスの標準形式
 * 全てのAPI呼び出しで一貫したレスポンス構造を提供します
 */
export interface ApiResponse<T = unknown> {
  success: boolean; // 処理成功フラグ
  data?: T; // レスポンスデータ（成功時）
  error?: string; // エラーメッセージ（失敗時）
  message?: string; // 追加メッセージ
}

/**
 * ページネーションのパラメータ
 * リスト取得時の検索条件として使用されます
 */
export interface PaginationParams {
  page: number; // ページ番号（1から開始）
  limit: number; // 1ページあたりの表示件数
}

/**
 * ページネーション対応のAPIレスポンス
 * リスト取得APIで使用されます
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number; // 現在のページ番号
    limit: number; // 1ページあたりの表示件数
    total: number; // 全体の件数
    pages: number; // 総ページ数
  };
}

/**
 * 非同期処理の状態を表す型
 * ローディング状態の管理に使用されます
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * 全エンティティの基底インターフェース
 * 共通のフィールドを定義します
 */
export interface BaseEntity {
  id: string; // 一意識別子
  createdAt: Date; // 作成日時
  updatedAt: Date; // 最終更新日時
}

/**
 * 商品情報を表すインターフェース
 * 商品管理やメニュー表示で使用されます
 */
export interface Product extends BaseEntity {
  name: string; // 商品名
  description: string | null; // 商品説明
  price: number; // 価格（円単位）
  imageUrl: string | null; // 商品画像URL
  category: string | null; // カテゴリ
  isActive: boolean; // 販売状態フラグ
}

// Customer型のエクスポート
export type { Customer } from './customer';
