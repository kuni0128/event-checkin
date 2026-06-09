# 開発環境セットアップ手順（PBI #1）

コードの雛形（このリポジトリ）に加えて、以下はコード外で手動セットアップが必要。設計書 §8「環境・デプロイ構成」に対応する。

担当者が実施し、取得した値（URL / キー）はチームのシークレット管理に保管したうえで、各自の `.env` に設定する。

---

## 0. 全体像

```
Slack App (OAuth クライアント)
        │  client id / secret, redirect URL
        ▼
Supabase Auth (Slack プロバイダ)  ──  Postgres + RLS / Realtime
        │  project URL / publishable key
        ▼
React SPA (Vite)  ──  Lovable ホスティング (preview / production) + GitHub 同期
```

シークレットの置き場所（設計書 §8）:

- **フロント (`.env`)**: 公開可能な `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` のみ。
- **Supabase 側**: secret key・Slack client secret などの機密値。フロントには絶対に置かない。

---

## 1. Supabase プロジェクト

1. https://supabase.com でプロジェクトを作成（MVP は 1 プロジェクト。必要に応じ dev/prod 分離 — 設計書 §8）。
2. リージョン・DB パスワードを設定。
3. **Project Settings > Data API** で `Project URL` を取得 → `.env` の `VITE_SUPABASE_URL`。
4. **Project Settings > API Keys** で **Publishable key**（`sb_publishable_...`）を取得 → `.env` の `VITE_SUPABASE_PUBLISHABLE_KEY`。
   - レガシーの `anon` key でも動作するが、ダッシュボードの推奨どおり publishable key を使う。どちらもブラウザ公開前提のキー。
   - 安全性は RLS（PBI #2 で設定）が担保する。RLS 未設定のうちは開発用途に留める。
5. **Secret key**（`sb_secret_...` / レガシーの `service_role`）はフロントで使わない。サーバー処理（将来の Edge Functions 等）専用。

> テーブル・RLS・精算ビュー・Realtime publication は PBI #2（DB マイグレーション）で構築する。本 PBI ではプロジェクトの存在と接続情報の取得まで。

---

## 2. Slack App（OAuth クライアント）

> ⚠️ 未確定事項: **どのアカウント / ワークスペースで Slack App を作成するか** をチームで確定してから着手する（issue #3 参照）。

1. https://api.slack.com/apps で **Create New App**（From scratch）。社内ワークスペースを選択。
2. **OAuth & Permissions** で User Token Scopes に `openid` `email` `profile`（OIDC 相当）を設定。
3. **Basic Information** から `Client ID` / `Client Secret` を取得。
   - Client Secret は **Supabase 側に設定**する（手順 4）。フロントには置かない。
4. Redirect URL は手順 4・5 の Supabase コールバック URL を登録する。

---

## 3. Supabase Auth に Slack プロバイダを設定

1. Supabase ダッシュボード **Authentication > Sign In / Providers > Slack (OIDC)** を有効化。
2. 手順 2 で取得した Slack の `Client ID` / `Client Secret` を入力。
3. 画面に表示される **Callback URL（`https://<project-ref>.supabase.co/auth/v1/callback`）** を控える。
   - この URL を **Slack App の Redirect URLs に登録**する（手順 2-4）。
4. メール / パスワード等の他プロバイダは有効化しない（設計書 §3.1: Slack OAuth のみ）。

---

## 4. OAuth リダイレクト URL（preview / production）

> ⚠️ 未確定事項: **preview / production のドメイン確定後**に登録する（issue #3 参照）。ドメインが決まるまでは localhost のみで開発。

ドメイン確定後、以下の双方に preview と production の URL を登録する（設計書 §8）。

| 登録先 | 登録する URL |
| --- | --- |
| Slack App > Redirect URLs | Supabase の Callback URL（`https://<project-ref>.supabase.co/auth/v1/callback`） |
| Supabase Auth > URL Configuration > Site URL / Redirect URLs | `http://localhost:5173`, preview ドメイン, production ドメイン |

---

## 5. Lovable ホスティング + GitHub 同期

1. Lovable プロジェクトを作成し、この GitHub リポジトリ（`kuni0128/event-checkin`）と同期する。
2. preview / production の配信は Lovable のホスティングを使う。コード履歴は GitHub 同期で保持（設計書 §8）。
3. Lovable のビルド環境変数に `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` を設定する。

---

## チェックリスト

- [ ] Supabase プロジェクト作成・接続情報（URL / publishable key）取得
- [ ] Slack App 作成（作成先ワークスペース確定）・OIDC scope 設定
- [ ] Supabase Auth に Slack プロバイダ設定・Callback URL を Slack に登録
- [ ] preview / production ドメイン確定後、双方に OAuth リダイレクト URL 登録
- [ ] Lovable プロジェクト ↔ GitHub 同期・ビルド環境変数設定
- [ ] 各開発者が `.env` を用意し `npm run dev` で疎通確認
