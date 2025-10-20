import { redirect } from 'next/navigation';

/**
 * ルートページ
 * デフォルトで顧客向けメニューページにリダイレクト
 */
export default function Home() {
  redirect('/menu');
}
