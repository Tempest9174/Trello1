# CLAUDE.md — Claude Code 厳守ルール

このファイルは Claude Code が読み込む設定ファイルです。
以下のルールは **例外なく** すべての作業で守ってください。

---

## 1. 作業開始フロー（必須）

新しい作業を始めるときは **必ずこの順序** で行う:

```
① GitHub Issue を作成する（gh issue create）
② 発行された Issue 番号を確認する
③ Issue 番号を含むブランチを作成する（git checkout -b feature/#<番号>-<内容>）
④ ブランチ上で作業・コミット・プッシュする
⑤ develop への PR を作成する
```

Issue を作成せずにブランチを切ることは禁止。

---

## 2. ブランチ命名規則

| プレフィックス | 用途 | 例 |
|---|---|---|
| `feature/#<番号>-<内容>` | 機能追加 | `feature/#12-add-card-api` |
| `fix/#<番号>-<内容>` | バグ修正 | `fix/#15-fix-card-position` |
| `docs/#<番号>-<内容>` | ドキュメント更新 | `docs/#8-update-readme` |

- `<番号>` は GitHub Issue の番号と必ず一致させる
- `<内容>` は英語・ハイフン区切り・小文字
- 上記3種類以外のプレフィックスは使用禁止

---

## 3. コミット・プッシュのルール

- **main・develop への直接コミット・プッシュは禁止**
- すべての変更は feature ブランチで行い、PR 経由でマージする
- コミットメッセージは **日本語** で書く
- develop → main のマージは **ユーザーが明示的に指示したときのみ** 実行する

---

## 4. PR ルール

- PR のベースブランチは `develop`（develop → main の PR のみ例外）
- PR タイトルには対応する Issue 番号を含める（例: `#12 カードAPI実装`）
- PR 作成時に Issue を Close するリンクを本文に記載する（`Closes #<番号>`）
- `Closes #` は main へのマージ時のみ自動クローズ。develop へのマージ後は `gh issue close <番号>` で手動クローズする

---

## 5. ブランチ保護

- `main` ブランチは GitHub のブランチ保護ルールで直接プッシュが禁止されている
- `develop` ブランチへの直接プッシュはシステム上は可能だが、このルールにより禁止とする

---

## 6. プロジェクト情報

- リポジトリ: `Tempest9174/Trello1`
- 通常作業ブランチ: `develop`
- 本番ブランチ: `main`
- 技術スタック: Java 21 + Spring Boot / React + TypeScript / PostgreSQL

---

## 7. ポート割り当て（固定）

| サービス | ポート | 設定ファイル |
|---------|--------|------------|
| バックエンド（Spring Boot） | 8080 | `backend/src/main/resources/application.yml` |
| フロントエンド（Vite） | 5173 | `frontend/vite.config.ts` |
| PostgreSQL（ホスト側） | 5433 | `docker-compose.yml` |
| pgAdmin | 5050 | `docker-compose.yml` |

- ポートは変更禁止。競合が発生した場合は **必ずそのプロセスを停止し、必ずデフォルトポートで起動する**
- 別のポート番号に変更して起動することは禁止
- フロントエンドは `strictPort: true` により、5173 が使用中なら自動で別ポートに切り替えず起動エラーになる
- 起動前に `/check-ports` コマンドで各ポートの空き状況を確認できる
- サーバーを起動する際は `/start` コマンドを使用すること（ポート解放→起動を自動で行う）

### ポート競合時の対処手順（必須）

```powershell
# 例: 8080 が競合している場合
$p = (Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue).OwningProcess | Select-Object -First 1
if ($p) { Stop-Process -Id $p -Force }
# → 停止後、必ず 8080 で再起動する
```

- PostgreSQL（5433）・pgAdmin（5050）は Docker 管理のため停止禁止
- 停止対象が不明なプロセスの場合はユーザーに確認すること
