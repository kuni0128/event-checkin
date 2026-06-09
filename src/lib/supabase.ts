import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Supabase の環境変数が未設定です。.env を作成し VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY を設定してください（.env.example 参照）。"
  );
}

// フロントには公開可能な publishable key（sb_publishable_...）のみを置く（設計書 §8）。
// secret key や Slack client secret は Supabase 側で管理する。安全性は RLS が担保する。
export const supabase = createClient(supabaseUrl, supabasePublishableKey);
