import { notFound } from 'next/navigation';

/**
 * ルートページ
 * 404を返す
 */
export default function Home() {
  notFound();
}
