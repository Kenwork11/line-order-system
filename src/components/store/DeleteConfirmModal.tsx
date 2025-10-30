/**
 * 削除確認モーダルコンポーネント
 * ユーザー、商品などのエンティティ削除時に確認ダイアログを表示します
 */

'use client';

import { useState } from 'react';
import { api } from '@/utils/api';
import Button from '@/components/ui/Button';

interface DeleteConfirmModalProps {
  title?: string;
  itemName: string;
  itemType?: string;
  apiEndpoint: string;
  onConfirm: (id: string) => void;
  onCancel: () => void;
}

/**
 * 削除確認モーダル
 *
 * @param title - モーダルのタイトル（デフォルト: "削除の確認"）
 * @param itemName - 削除対象の名前
 * @param itemType - 削除対象の種類（デフォルト: "項目"）
 * @param apiEndpoint - 削除APIのエンドポイント
 * @param onConfirm - 削除成功時のコールバック
 * @param onCancel - キャンセル時のコールバック
 */
export default function DeleteConfirmModal({
  title = '削除の確認',
  itemName,
  itemType = '項目',
  apiEndpoint,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(apiEndpoint);

      if (response.success) {
        // APIエンドポイントからIDを抽出
        const id = apiEndpoint.split('/').pop() || '';
        onConfirm(id);
      } else {
        setError(response.error || `${itemType}の削除に失敗しました`);
      }
    } catch {
      setError(`${itemType}の削除に失敗しました`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {title}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          <strong>{itemName}</strong> を削除してもよろしいですか？
          <br />
          この操作は取り消せません。
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded">
            {error}
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            onClick={onCancel}
            disabled={loading}
            variant="secondary"
            className="flex-1"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleDelete}
            disabled={loading}
            variant="destructive"
            className="flex-1"
          >
            {loading ? '削除中...' : '削除'}
          </Button>
        </div>
      </div>
    </div>
  );
}
