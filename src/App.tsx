import { Routes, Route } from "react-router-dom";

import { Button } from "@/components/ui/button";

/**
 * PBI #1（環境構築）時点のアプリ雛形。
 * Vite + React + Tailwind + shadcn/ui + Supabase クライアントの疎通を確認するためのランディングのみ。
 * 各画面（/login, /e/:token/checkin, /events/... 等）は後続 PBI で追加する（設計書 §4）。
 */
function Landing() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          イベントチェックイン
        </h1>
        <p className="text-muted-foreground">
          開発環境セットアップ（PBI #1）— Vite + React + Tailwind + shadcn/ui +
          Supabase
        </p>
      </div>
      <Button>セットアップ完了</Button>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
    </Routes>
  );
}

export default App;
