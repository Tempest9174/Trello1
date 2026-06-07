# タスク管理Webアプリケーション

タスクをカード形式で管理できるWebアプリです。列（リスト）を自由に作り、カードをドラッグ＆ドロップで移動しながら作業を管理できます。

---

## 機能

- ボードの作成・編集・削除（複数のボードを切り替えて使用可能）
- リスト（列）の追加・編集・削除・並び替え
- カードの作成・編集・削除（タイトル・説明・期限日・優先度・ラベルを設定可能）
- カードのドラッグ＆ドロップ移動・並び替え
- ラベル（色タグ）の作成・カードへの付与

---

## 使用技術

### フロントエンド

| パッケージ | バージョン | 用途 |
|---|---|---|
| React | 19.2.6 | UIフレームワーク |
| TypeScript | 6.0.2 | 型付きJavaScript |
| Vite | 8.0.12 | ビルドツール・開発サーバー |
| Tailwind CSS | 3.4.19 | CSSフレームワーク |
| Axios | 1.16.1 | API通信 |
| react-hot-toast | 2.6.0 | 通知 |
| @dnd-kit/core | 6.3.1 | ドラッグ＆ドロップ |
| @dnd-kit/utilities | 3.2.2 | ドラッグ＆ドロップユーティリティ |

### バックエンド

| 技術 | バージョン | 用途 |
|---|---|---|
| Java | 25（コンパイル）/ 21（Gradle実行） | 言語・実行環境 |
| Spring Boot | 4.0.6 | Webフレームワーク |
| Spring Data JPA | - | DBアクセス |
| Lombok | - | ボイラープレート削減 |

### データベース・インフラ

| 技術 | バージョン | 用途 |
|---|---|---|
| PostgreSQL | 16 | データベース |
| pgAdmin | latest | DB管理画面 |
| Docker Compose | - | コンテナ管理 |

---

## 起動手順

### 前提条件

- Java 21 および Java 25 がインストールされていること（`JAVA_HOME` は Java 21 に設定）
- Node.js 20 以上（npm 10 以上同梱）がインストールされていること
- Docker Desktop が起動していること

### 1. データベースの起動（Docker）

`.env` ファイルをプロジェクトルートに作成して、以下の内容を記述してください。

```env
POSTGRES_DB=taskmanagement
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin
```

その後、Docker Compose でPostgreSQLを起動します。

```bash
docker-compose up -d
```

`http://localhost:5050` でpgAdmin（DB管理画面）にアクセスできます。

### 2. バックエンドの起動

```bash
cd backend
./gradlew bootRun
```

`http://localhost:8080/api/tasks` にアクセスして `[]` が返れば正常に起動しています。

### 3. フロントエンドの起動

```bash
cd frontend
npm install
npm run dev
```

`http://localhost:5173` をブラウザで開いてください。

---

## ポート一覧

| サービス | ポート | URL |
|---|---|---|
| フロントエンド（Vite） | 5173 | http://localhost:5173 |
| バックエンド（Spring Boot） | 8080 | http://localhost:8080 |
| PostgreSQL | 5433 | - |
| pgAdmin | 5050 | http://localhost:5050 |

---

## 開発フロー

```
① GitHub Issue を作成（gh issue create）
② Issue 番号を含むブランチを作成
   git checkout -b feature/#<番号>-<内容>
③ ブランチ上で実装・コミット・プッシュ
④ develop への Pull Request を作成
⑤ CI（lint・build）が通ることを確認
⑥ マージ → Issue をクローズ
```

**ブランチ命名規則**

| プレフィックス | 用途 |
|---|---|
| `feature/#<番号>-<内容>` | 機能追加 |
| `fix/#<番号>-<内容>` | バグ修正 |
| `docs/#<番号>-<内容>` | ドキュメント更新 |

---

## API仕様

ベースURL: `http://localhost:8080`

| メソッド | エンドポイント | 説明 | ステータス |
|---|---|---|---|
| GET | `/api/tasks` | タスク一覧取得 | 200 |
| POST | `/api/tasks` | タスク作成 | 201 |
| PUT | `/api/tasks/{id}` | タスク更新 | 200 |
| PATCH | `/api/tasks/{id}/status` | ステータス変更 | 200 |
| DELETE | `/api/tasks/{id}` | タスク削除 | 204 |

### リクエスト形式

**タスク作成・更新（POST / PUT）**
```json
{
  "title": "タスクタイトル",
  "description": "説明（任意）",
  "priority": "HIGH",
  "dueDate": "2026-06-30"
}
```

> `priority` は `HIGH` / `MEDIUM` / `LOW` のいずれか。`dueDate` は省略可（`YYYY-MM-DD` 形式）。

**ステータス変更（PATCH）**
```json
{
  "status": "IN_PROGRESS"
}
```

> `status` は `TODO` / `IN_PROGRESS` / `DONE` のいずれか。

### レスポンス形式

```json
{
  "id": 1,
  "title": "タスクタイトル",
  "description": "説明",
  "priority": "HIGH",
  "dueDate": "2026-06-30",
  "status": "TODO",
  "position": 0,
  "createdAt": "2026-06-05T12:00:00",
  "updatedAt": "2026-06-05T12:00:00"
}
```

---

## ドキュメント

| ドキュメント | 内容 |
|------------|------|
| [要件定義書](docs/requirements.md) | 概要・全ドキュメントへのリンク集 |
| [機能要件（詳細）](docs/functional_requirements.md) | FR-01〜FR-05・バリデーション・受け入れ基準 |
| [非機能要件・技術スタック](docs/non_functional.md) | NFR・技術構成・動作環境 |
| [ユースケース・操作フロー](docs/use_cases.md) | UC-01〜UC-05 |
| [開発スケジュール](docs/schedule.md) | フェーズ1・2 ステップ一覧 |
| [画面遷移・設計書](docs/screen_flow.md) | 画面遷移図・ワイヤーフレーム |
| [E-R図・データ設計書](docs/er_diagram.md) | テーブル設計・リレーション |
| [用語解説集](docs/glossary.md) | 技術用語の説明 |
| [Web筆記テスト 問題・解答](docs/web_test_questions.md) | Web技術の筆記テスト問題と解答メモ |
