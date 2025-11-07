/**
 * モーダルコンポーネント
 * 注文確定やエラーなど、重要な通知を中央に表示します
 */

'use client';

import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  orderNumber?: string;
  onClose: () => void;
}

const typeStyles = {
  success: {
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    buttonBg: 'bg-green-600 hover:bg-green-700',
  },
  error: {
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    buttonBg: 'bg-red-600 hover:bg-red-700',
  },
  info: {
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    buttonBg: 'bg-blue-600 hover:bg-blue-700',
  },
};

const typeIcons = {
  success: (
    <svg
      className="w-12 h-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  error: (
    <svg
      className="w-12 h-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  info: (
    <svg
      className="w-12 h-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

/**
 * モーダルコンポーネント
 *
 * @param isOpen - モーダルの表示状態
 * @param type - モーダルの種類（成功・エラー・情報）
 * @param title - モーダルのタイトル
 * @param message - 表示するメッセージ
 * @param orderNumber - 注文番号（成功時のみ）
 * @param onClose - 閉じる時のコールバック
 *
 * @example
 * <Modal
 *   isOpen={true}
 *   type="success"
 *   title="注文完了"
 *   message="ご注文ありがとうございます"
 *   orderNumber="20250106-001"
 *   onClose={() => setModalOpen(false)}
 * />
 */
export default function Modal({
  isOpen,
  type,
  title,
  message,
  orderNumber,
  onClose,
}: ModalProps) {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // モーダル表示中はスクロールを無効化
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const styles = typeStyles[type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{ alignItems: 'center' }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* アイコン */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-24 h-24 rounded-full ${styles.iconBg} ${styles.iconColor} flex items-center justify-center`}
          >
            {typeIcons[type]}
          </div>
        </div>

        {/* タイトル */}
        <h2
          id="modal-title"
          className="text-3xl font-bold text-gray-900 text-center mb-3"
        >
          {title}
        </h2>

        {/* メッセージ */}
        <p className="text-gray-600 text-center text-lg mb-6">{message}</p>

        {/* 注文番号（成功時のみ） */}
        {orderNumber && (
          <div className="bg-indigo-600 rounded-lg p-5 mb-6">
            <p className="text-sm text-indigo-100 text-center mb-2">注文番号</p>
            <p className="text-2xl font-bold text-white text-center font-mono tracking-wider">
              {orderNumber}
            </p>
          </div>
        )}

        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className={`w-full py-4 text-white text-lg font-semibold rounded-lg transition-colors ${styles.buttonBg}`}
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
