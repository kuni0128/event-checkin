# event-checkin

イベントチェックインシステム MVP。会場掲示の QR からチェックインし、リアルタイムで人数・参加者一覧・割り勘精算を確認する社内向け SPA。

- 構成: React SPA（Vite + Tailwind + shadcn/ui）→ Supabase（Auth / Postgres + RLS / Realtime）へ直接アクセスするサーバーレス・BaaS 構成。独自バックエンドは持たない。
- 認証: Supabase Auth の Slack OAuth プロバイダのみ。
- 全体設計書: https://app.notion.com/p/37a2eee36fbb808f8ca7d11b3e961fb0
- PRD: https://app.notion.com/p/37a2eee36fbb80fc9b4fd7231af5b5a6

## 技術スタック

| 領域 | 採用 |
| --- | --- |
| ビルド / 開発 | Vite 6 |
| UI | React 18 + TypeScript |
| スタイル | Tailwind CSS 3 + shadcn/ui |
| ルーティング | react-router-dom 6 |
| BaaS | Supabase（`@supabase/supabase-js`） |

## セットアップ

```bash
# 1. 依存をインストール
npm install

# 2. 環境変数を用意
cp .env.example .env
# .env に Supabase の URL / anon key を設定（取得手順は docs/setup.md）

# 3. 開発サーバー起動
npm run dev
```

`http://localhost:5173` でランディングが表示されれば雛形は疎通済み。

> Supabase プロジェクト・Slack App・OAuth リダイレクト URL など、コード外の手動セットアップ手順は [docs/setup.md](docs/setup.md) を参照。

## スクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー |
| `npm run build` | 型チェック + 本番ビルド |
| `npm run preview` | ビルド成果物のプレビュー |
| `npm run lint` | ESLint |
| `npm run typecheck` | 型チェックのみ |

## ディレクトリ構成

```
src/
  components/ui/   # shadcn/ui コンポーネント
  lib/
    supabase.ts    # Supabase クライアント（anon key のみ）
    utils.ts       # cn() ヘルパ
  App.tsx          # ルーティング（PBI #1 はランディングのみ）
  main.tsx
docs/
  setup.md         # 外部サービスの手動セットアップ手順
```

## 実装ロードマップ（PBI）

設計書 §10 の順序に従う。

1. **#1 環境構築**（本リポジトリの雛形）← 現在ここ
2. #2 DB マイグレーション（3 表 + UNIQUE + 精算ビュー + RLS）
3. #3 認証（Slack ログイン + profiles upsert トリガ）
4. #4 イベント作成・一覧
5. #6 チェックイン
6. #7 ダッシュボード
7. #5 QR 表示 / #8 精算
