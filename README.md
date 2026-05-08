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
- React + TypeScript + Vite
- Tailwind CSS
- dnd-kit（ドラッグ＆ドロップ）
- Zustand（状態管理）
- Axios（API通信）

**バックエンド（サーバー）**
- Java 17 + Spring Boot 3
- Spring Data JPA + Lombok

**データベース**
- MySQL / MariaDB

---

## 起動手順

### 前提条件

- Java 17 以上がインストールされていること
- Node.js 18 以上がインストールされていること
- MySQL または MariaDB が起動していること

### 1. データベースの準備

MySQL にログインして、データベースとテーブルを作成してください。

```sql
CREATE DATABASE trello_clone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

その後、`schema.sql` を実行してテーブルを作成します。

```bash
mysql -u root -p trello_clone < schema.sql
```

`SHOW TABLES;` で5つのテーブルが表示されれば完了です。

### 2. バックエンドの起動

```bash
cd backend
mvn spring-boot:run
```

`http://localhost:8080/api/boards` にアクセスして `[]` が返れば正常に起動しています。

### 3. フロントエンドの起動

```bash
cd frontend
npm install
npm run dev
```

`http://localhost:5173` をブラウザで開いてください。

---

## ドキュメント

- [要件定義書](docs/requirements.md)
- [用語解説集（開発者向け）](docs/glossary.md)
