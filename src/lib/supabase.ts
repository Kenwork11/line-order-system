/**
 * Supabase クライアント設定
 * クライアントサイド用のSupabaseクライアント
 */

import { createClient } from '@supabase/supabase-js';

// 環境変数の検証と取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
}

// クライアントサイド用のSupabaseクライアント
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
