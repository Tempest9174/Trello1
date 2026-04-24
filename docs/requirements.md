# Trelloクローン アプリ 設計・要件定義

## 概要
学習目的でTrelloライクなタスク管理アプリを作成する。
バックエンド（Java）・REST API・フロントエンドとの連携・ドラッグ＆ドロップを学ぶことが主目的。
認証なし・シンプルな構成で、Trelloの核心機能を実装する。

---

## 機能要件

### 必須機能
| 対象 | 作成 | 編集 | 削除 | 補足 |
|------|:----:|:----:|:----:|------|
| ボード | ✓ | ✓（タイトル） | ✓ | 複数ボードを切り替え可能 |
| リスト（列） | ✓ | ✓（タイトル） | ✓ | ボード内に複数。並び替えも可 |
| カード | ✓ | ✓（タイトル・説明・期限日・タグ・優先度） | ✓ | リスト内に複数。並び替えも可 |
| ドラッグ＆ドロップ | — | — | — | カードをリスト間・リスト内で移動 |
| 色タグ（ラベル） | ✓ | ✓（名前・色） | ✓ | ボード単位で管理、カードに付与・外せる |

### あると便利な機能（余裕があれば実装）
| 機能 | 説明 |
|------|------|
| 複数ボード | 「仕事用」「個人用」など複数のボードを作成・切り替えできる |

### 対象外
- ファイル添付（スコープ外）
- ログイン・ユーザー管理（認証なし・シングルユーザー前提）

---

## 技術スタック（各技術の役割説明つき）

```
┌─────────────────────────────────────────────┐
│  ブラウザ（ユーザーが見る画面）                │
│  React + TypeScript                          │
│  ┌──────────────────────────────────────┐   │
│  │  ボード画面・カード・ドラッグ機能      │   │
│  └──────────────────────────────────────┘   │
└────────────────┬────────────────────────────┘
                 │ HTTP通信（REST API）
                 │ データの送受信（JSON形式）
┌────────────────▼────────────────────────────┐
│  サーバー（バックエンド）                      │
│  Java + Spring Boot                          │
│  ┌──────────────────────────────────────┐   │
│  │  APIの処理（作成・更新・削除・取得）   │   │
│  └──────────────────────────────────────┘   │
└────────────────┬────────────────────────────┘
                 │ JPA（データアクセス）
┌────────────────▼────────────────────────────┐
│  データベース                                  │
│  MySQL                                       │
│  ┌──────────────────────────────────────┐   │
│  │  ボード・リスト・カードの永続保存      │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### 各技術の役割

| 技術 | 役割 | 例え |
|------|------|------|
| **React** | 画面（UI）を作るJavaScriptライブラリ | ボード・カードなどの部品を組み立てる |
| **TypeScript** | JavaScriptに型チェックを追加したもの | 変数の型ミスをコンパイル時に検出できる |
| **Vite** | Reactアプリを高速に起動・ビルドするツール | 開発中のホットリロードも担う |
| **Tailwind CSS** | クラス名だけでスタイルを書けるCSSツール | `class="bg-blue-500 p-4"` のように書く |
| **dnd-kit** | ドラッグ＆ドロップを実装するReactライブラリ | Trelloのカード移動を実現 |
| **Zustand** | Reactアプリ内でデータ（状態）を管理するライブラリ | Redux より圧倒的にシンプル |
| **Axios** | JavaScriptからHTTPリクエストを送るライブラリ | fetch APIのラッパー、エラー処理が楽 |
| **Spring Boot** | JavaでWebサーバー・APIを作る定番フレームワーク | アノテーションだけでAPIエンドポイントが作れる |
| **Spring Data JPA** | JavaオブジェクトとDBテーブルをマッピングするORM | SQL文を書かずにDB操作ができる |
| **MySQL** | データをテーブル形式で保存するリレーショナルDB | ボード・カード等の永続保存 |
| **Lombok** | Javaのボイラープレート（getter/setter等）を自動生成 | `@Data` で全フィールドのgetterが生成される |

---

## プロジェクト構成

```
TaskManagement/
├── docs/
│   └── requirements.md           ← このファイル
├── frontend/                     ← Reactアプリ
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── .env                      ← VITE_API_BASE_URL=http://localhost:8080/api
│   └── src/
│       ├── main.tsx              ← エントリポイント
│       ├── App.tsx               ← ルーター定義
│       ├── types/index.ts        ← 型定義（Board, List, Card, Label）
│       ├── api/
│       │   ├── axiosInstance.ts  ← Axios設定（baseURL・エラー処理）
│       │   ├── boardApi.ts
│       │   ├── listApi.ts
│       │   ├── cardApi.ts
│       │   └── labelApi.ts
│       ├── store/
│       │   └── boardStore.ts     ← Zustandストア（全状態を一元管理）
│       └── components/
│           ├── HomePage.tsx      ← ボード一覧・作成・編集・削除画面
│           ├── BoardPage.tsx     ← メイン画面（D&D含む）
│           ├── ListColumn.tsx    ← リスト列（タイトル編集・削除ボタン付き）
│           ├── CardItem.tsx      ← カードコンポーネント（ドラッグ可）
│           ├── CardModal.tsx     ← カード詳細モーダル（タイトル・説明・期限日・優先度・ラベル編集・削除）
│           └── LabelPicker.tsx   ← ラベル選択ポップオーバー
│
└── backend/                      ← Spring Bootアプリ
    ├── pom.xml
    └── src/main/
        ├── java/com/trello/app/
        │   ├── TrelloApplication.java
        │   ├── config/
        │   │   └── CorsConfig.java       ← CORS設定（フロントからのリクエストを許可）
        │   ├── entity/                   ← DBテーブルに対応するJavaクラス
        │   │   ├── Board.java
        │   │   ├── BoardList.java        ← "List"はJavaの予約語のため命名変更
        │   │   ├── Card.java
        │   │   └── Label.java
        │   ├── repository/               ← DBアクセス（JpaRepository継承のみ）
        │   ├── service/                  ← ビジネスロジック
        │   ├── controller/               ← APIエンドポイント定義
        │   ├── dto/
        │   │   ├── request/              ← リクエストボディの型
        │   │   └── response/             ← レスポンスの型
        │   └── exception/
        │       ├── ResourceNotFoundException.java
        │       └── GlobalExceptionHandler.java
        └── resources/
            └── application.properties    ← DB接続設定・サーバーポート等
```

---

## データベーススキーマ

### テーブル関係図

```
boards ────< board_lists ────< cards >────< labels
                                           (card_labels 中間テーブル)
```

### SQL

```sql
CREATE DATABASE trello_clone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ボード
CREATE TABLE boards (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    title      VARCHAR(255) NOT NULL,
    background VARCHAR(7)   NOT NULL DEFAULT '#0079BF',
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- リスト（列）
CREATE TABLE board_lists (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    board_id   BIGINT       NOT NULL,
    title      VARCHAR(255) NOT NULL,
    position   DOUBLE       NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

-- カード
CREATE TABLE cards (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    list_id     BIGINT       NOT NULL,
    title       VARCHAR(500) NOT NULL,
    description TEXT,
    position    DOUBLE       NOT NULL DEFAULT 0,
    due_date    DATE,
    priority    ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL DEFAULT 'MEDIUM',
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (list_id) REFERENCES board_lists(id) ON DELETE CASCADE
);

-- ラベル（ボード単位で管理）
CREATE TABLE labels (
    id       BIGINT     NOT NULL AUTO_INCREMENT,
    board_id BIGINT     NOT NULL,
    name     VARCHAR(50),
    color    VARCHAR(7) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

-- カードとラベルの紐付け（多対多）
CREATE TABLE card_labels (
    card_id  BIGINT NOT NULL,
    label_id BIGINT NOT NULL,
    PRIMARY KEY (card_id, label_id),
    FOREIGN KEY (card_id)  REFERENCES cards(id)  ON DELETE CASCADE,
    FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
);
```

---

## 画面構成

### 画面遷移図

```
┌─────────────────┐
│   ホーム画面     │  ← アプリ起動時
│  （ボード一覧）  │
└────────┬────────┘
         │ ボードをクリック
         ▼
┌─────────────────┐       ┌──────────────────────┐
│   ボード画面     │──────▶│  カード詳細モーダル   │
│  （メイン画面）  │       │  （カードをクリック） │
└─────────────────┘       └──────────────────────┘
```

### ① ホーム画面（ボード一覧）

```
┌────────────────────────────────────────────────────────┐
│  Trello Clone                                          │  ← ヘッダー
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  仕事用  │  │  個人用  │  │  学習用  │  ← ボードカード
│  │  [編集]  │  │  [編集]  │  │  [編集]  │
│  │  [削除]  │  │  [削除]  │  │  [削除]  │
│  └──────────┘  └──────────┘  └──────────┘
│                                                        │
│  ┌────────────────┐                                   │
│  │  + 新しいボード │                                   │
│  └────────────────┘                                   │
└────────────────────────────────────────────────────────┘
```

**操作:**
- ボードカードをクリック → ボード画面へ遷移
- [編集] → タイトルをインライン編集
- [削除] → 確認ダイアログ → ボードとその中身を全削除
- [+ 新しいボード] → タイトル入力フォームが展開

### ② ボード画面（メイン画面）

```
┌────────────────────────────────────────────────────────────────────┐
│  <- 戻る  |  仕事用ボード  [タイトル編集]                           │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ やること [編集削除]  進行中 [編集削除]  完了   [編集削除]        │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤
│  │ [HIGH]       │  │ [MEDIUM]     │  │ [LOW]        │  ← 優先度
│  │ タスクA      │  │ タスクC      │  │ タスクE      │
│  │ 期限: 5/1   │  │ ラベル:バグ  │  │              │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤
│  │ + カード追加 │  │ + カード追加 │  │ + カード追加 │
│  └──────────────┘  └──────────────┘  └──────────────┘
│                                                                    │
│  ┌───────────┐                                                     │
│  │ + リスト追加 │                                                   │
│  └───────────┘                                                     │
└────────────────────────────────────────────────────────────────────┘
```

**操作:**
- カードをドラッグ → 別リストや同リスト内の別位置に移動
- リストをドラッグ → 列の並び替え
- カードをクリック → カード詳細モーダルが開く

**カードの表示要素:**
| 要素 | 表示条件 |
|------|---------|
| カードタイトル | 常に表示 |
| 優先度バッジ（HIGH / MEDIUM / LOW） | 常に表示 |
| 期限日バッジ（MM/DD） | 設定されている場合 |
| ラベルバッジ（色帯） | 1つ以上付与されている場合 |

### ③ カード詳細モーダル

```
┌───────────────────────────────────────────────────────────┐
│  [x 閉じる]                                               │
│                                                           │
│  タイトル                                                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │ タスクAのタイトル                                   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  優先度: [HIGH v]  （セレクトボックス）                    │
│                                                           │
│  期限日: [ 2026-05-01 ]                                   │
│                                                           │
│  ラベル                                                    │
│  ┌─────────────────────────────────────┐                 │
│  │ [バグ x]  [機能追加 x]              │                 │
│  │ [+ ラベルを追加]                    │                 │
│  └─────────────────────────────────────┘                 │
│                                                           │
│  説明                                                     │
│  ┌────────────────────────────────────────────────────┐  │
│  │  （ここにメモを書く）                               │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  [保存]                            [カードを削除]         │
└───────────────────────────────────────────────────────────┘
```

### ④ ラベル追加ポップオーバー

```
┌──────────────────────────┐
│  ラベルを選択             │
│ ─────────────────────── │
│  [v] バグ                │
│  [ ] 機能追加            │
│  [ ] 緊急                │
│ ─────────────────────── │
│  + 新しいラベルを作成    │
└──────────────────────────┘
```

---

## REST API エンドポイント一覧

> **REST API とは**: フロントエンドとバックエンドがデータをやり取りするためのルール。  
> URLとHTTPメソッド（GET/POST/PUT/DELETE）の組み合わせで「何をするか」を表す。

```
GET    /api/boards                           ボード一覧を取得
POST   /api/boards                           ボードを新規作成 { title }
GET    /api/boards/{id}                      ボード詳細取得（リスト・カード含む）
PUT    /api/boards/{id}                      ボードのタイトルを更新
DELETE /api/boards/{id}                      ボードを削除（リスト・カードも連鎖削除）

GET    /api/boards/{id}/lists                そのボードのリスト一覧
POST   /api/boards/{id}/lists                リストを作成 { title }
PUT    /api/lists/{id}                       リストのタイトルを更新
PATCH  /api/lists/{id}/move                  リストの並び順を変更 { position }
DELETE /api/lists/{id}                       リストを削除

POST   /api/lists/{id}/cards                 カードを作成 { title }
GET    /api/cards/{id}                       カード詳細取得（ラベル含む）
PUT    /api/cards/{id}                       カードを更新（タイトル・説明・期限日・優先度）
PATCH  /api/cards/{id}/move                  カードを移動 { listId, position }  ★D&D用
DELETE /api/cards/{id}                       カードを削除

GET    /api/boards/{id}/labels               ラベル一覧取得
POST   /api/boards/{id}/labels               ラベルを作成 { name, color }
PUT    /api/labels/{id}                      ラベルを更新 { name, color }
DELETE /api/labels/{id}                      ラベルを削除
POST   /api/cards/{id}/labels/{labelId}      カードにラベルを付与
DELETE /api/cards/{id}/labels/{labelId}      カードからラベルを外す
```

---

## ドラッグ＆ドロップの仕組み

### positionフィールドの設計（DOUBLE型・浮動小数点）

```
初期状態:
  カードA: position = 1000.0
  カードB: position = 2000.0
  カードC: position = 3000.0

AとBの間に新カードDを挿入:
  position = (1000.0 + 2000.0) / 2 = 1500.0

→ 更新が必要なのはDの1件だけ！
```

### D&D時のAPIフロー

```
1. ユーザーがカードをドラッグして別の列にドロップ
2. dnd-kit がドロップ先のインデックスを検出
3. 新しい position を計算: (前のカード.position + 後のカード.position) / 2
4. PATCH /api/cards/{id}/move を呼ぶ: { listId, position }
5. バックエンドがDBを更新
6. フロントは即時更新（楽観的更新）
```

---

## フロントエンドとバックエンドをつなぐ仕組み

### CORS設定（Spring Boot側）

ブラウザのセキュリティポリシーにより、フロント（port 5173）→ バックエンド（port 8080）間のリクエストは初期状態でブロックされる。Spring Boot側で以下の設定が必要。

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS");
    }
}
```

### データの流れ（例: カード作成）

```
React                          Spring Boot                    MySQL
  │                                 │                           │
  │  POST /api/lists/1/cards        │                           │
  │  { "title": "新しいタスク" } ──>│                           │
  │                                 │  INSERT INTO cards ... ──>│
  │  <── 201 Created                │                           │
  │  { id: 10, title: "...", ... }  │                           │
```

---

## 主要設定ファイル

### application.properties

```properties
server.port=8080

spring.datasource.url=jdbc:mysql://localhost:3306/trello_clone?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=trello
spring.datasource.password=trello123

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
```

### フロントエンド主要パッケージ

| パッケージ | 用途 |
|-----------|------|
| `@dnd-kit/core` + `@dnd-kit/sortable` | ドラッグ＆ドロップ |
| `zustand` | 状態管理 |
| `axios` | HTTP通信 |
| `react-router-dom` | ページ遷移 |
| `tailwindcss` | スタイリング |
| `@headlessui/react` | モーダル・ポップオーバー |
| `dayjs` | 日付フォーマット |

---

## 実装順序（学習ロードマップ）

### Phase 1: バックエンド（Java + Spring Boot）

```
Step 1: DBスキーマ作成・MySQL起動確認
Step 2: Spring Bootプロジェクト生成（Spring Initializr）
Step 3: Board の Entity → Repository → Service → Controller
         └ Postman で GET/POST/PUT/DELETE を疎通確認
Step 4: BoardList の実装（Boardとの外部キー関係を学ぶ）
Step 5: Card の実装（positionフィールド・並び順ロジックを学ぶ）
Step 6: Label と card_labels 中間テーブルの実装（多対多関係を学ぶ）
Step 7: DTO・例外ハンドリングを整備
```

### Phase 2: フロントエンド（React + TypeScript）

```
Step 8:  Viteプロジェクト生成・Tailwind・Axios設定
Step 9:  ボード一覧ページ（GET /api/boards）
Step 10: ボード詳細ページ（リスト・カードの表示）
Step 11: カード詳細モーダル（編集・ラベル・期限日・優先度）
Step 12: dnd-kit でドラッグ＆ドロップ実装
          └ PATCH /api/cards/{id}/move と連携
```

---

## 動作確認方法

```bash
# 1. DB起動 & スキーマ適用
mysql -u root -p < schema.sql
# → "SHOW TABLES;" で5テーブルが存在することを確認

# 2. バックエンド起動
cd backend
mvn spring-boot:run
# → http://localhost:8080/api/boards にアクセスして [] が返ればOK
# → Swagger UI: http://localhost:8080/swagger-ui.html でAPI仕様確認

# 3. フロントエンド起動
cd frontend
npm install
npm run dev
# → http://localhost:5173 でUI表示
# → ボード作成 → カード追加 → ドラッグ移動ができることを確認
```
