/**
 * テーマ切り替えボタンコンポーネント
 * ライトテーマとダークテーマを切り替える機能を提供します
 * アプリケーション全体のテーマ状態をZustandストアで管理します
 */

'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store';
import Button from '@/components/ui/Button';

/**
 * テーマ切り替えボタン
 *
 * 機能:
 * - 現在のテーマに応じたアイコン表示（🌙/☀️）
 * - クリックでテーマ切り替え
 * - HTML要素のクラス名を動的に変更してテーマを適用
 *
 * @returns テーマ切り替えボタンのJSX要素
 */
export default function ThemeToggle() {
  // Zustandストアからテーマ状態と切り替え関数を取得
  const { theme, toggleTheme } = useAppStore();

  /**
   * テーマが変更された時にHTML要素のクラス名を更新
   * Tailwind CSSのダークモード機能（class strategy）に対応
   */
  useEffect(() => {
    const root = window.document.documentElement;

    // 既存のテーマクラスを削除
    root.classList.remove('light', 'dark');

    // 新しいテーマクラスを追加
    root.classList.add(theme);
  }, [theme]); // themeが変更された時に実行

  return (
    <Button
      variant="outline" // 枠線スタイルのボタン
      size="sm" // 小サイズ
      onClick={toggleTheme} // クリック時にテーマ切り替え
      aria-label="Toggle theme" // アクセシビリティ対応
    >
      {/* 現在のテーマに応じてアイコンを表示 */}
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
}
