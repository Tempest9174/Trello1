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
