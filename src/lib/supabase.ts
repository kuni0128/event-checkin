import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase の環境変数が未設定です。.env を作成し VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY を設定してください（.env.example 参照）。"
  );
}

// フロントには公開可能な anon key のみを置く（設計書 §8）。
// サービスロールキーや Slack client secret は Supabase 側で管理する。
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
