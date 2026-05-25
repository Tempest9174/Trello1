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

**フロントエンド（画面）**
- React 19.2.6 + TypeScript 6.0.2 + Vite 8.0.12
- Tailwind CSS 3.4.19
- Axios 1.16.1（API通信）
- react-hot-toast 2.6.0（通知）
- dnd-kit（ドラッグ＆ドロップ・導入予定）


**バックエンド（サーバー）**
- Java 25（コンパイル）/ Java 21（Gradle実行）+ Spring Boot 4.0.6
- Spring Data JPA + Lombok

**データベース**
- PostgreSQL 16

---

## 起動手順

### 前提条件

- Java 21 および Java 25 がインストールされていること（`JAVA_HOME` は Java 21 に設定）
- Node.js 18 以上がインストールされていること
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
