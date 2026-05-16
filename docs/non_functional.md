# 非機能要件・技術スタック

---

## 1. 技術スタック

### フロントエンド（画面）

| 技術 | 役割 |
|------|------|
| React + TypeScript | UI構築・型安全な開発 |
| Vite | 高速な開発サーバー・ビルドツール |
| Tailwind CSS | スタイリング |
| dnd-kit | ドラッグ＆ドロップ操作 |
| Zustand | グローバル状態管理 |
| Axios | バックエンドとのAPI通信 |

### バックエンド（サーバー）

| 技術 | 役割 |
|------|------|
| Java 25（コンパイル） / Java 21（Gradle実行） | プログラミング言語 |
| Spring Boot 4.0.6 | Webアプリケーションフレームワーク |
| Spring Data JPA | データベース操作（ORM） |
| Lombok | ボイラープレートコード削減 |
| Gradle（Kotlin DSL） | 依存関係管理・ビルドツール |
| PostgreSQL JDBC Driver | PostgreSQLへの接続ドライバ |

### データベース

| 技術 | 役割 |
|------|------|
| PostgreSQL | データの永続化 |

---

## 2. 非機能要件

機能以外の品質・性能に関する要件です。

| 要件ID | カテゴリ | 内容 |
|--------|---------|------|
| NFR-01 | パフォーマンス | カード作成・移動などの通常操作の応答は2秒以内 |
| NFR-02 | パフォーマンス | ページ初期読み込みは5秒以内（ローカル環境） |
| NFR-03 | セキュリティ | SQLインジェクション・XSSなどの基本的なセキュリティ対策を実施する |
| NFR-04 | データ保全 | サーバーを停止してもデータベースのデータは消滅しない |
| NFR-05 | ブラウザ対応 | Chrome・Edge の最新版で正常に動作する |
| NFR-06 | 画面サイズ | 横幅1280px以上のPC画面での利用を前提とする |
| NFR-07 | 同時利用 | 1ユーザーによる単独利用を前提とする（複数人での同時操作は対象外） |

---

## 3. Javaツールチェーン構成

Gradleとコンパイル対象のJavaバージョンを分離する「ツールチェーン」方式を採用しています。

| 役割 | バージョン | 場所 |
|------|-----------|------|
| Gradle実行JVM | Java 21（`JAVA_HOME`） | `C:\Program Files\Eclipse Adoptium\jdk-21.0.1.12-hotspot` |
| ソースコードのコンパイル | Java 25（ツールチェーン） | `D:\`（Oracle JDK 25.0.3） |

**なぜこの構成か：** Gradle 8.14 + Kotlin DSL は Java 25 上で直接動作させると
クラスパスの競合が発生するため、Gradle 自体は Java 21 で動かしつつ、
ソースのコンパイルのみ Java 25 を使うことで両立しています。

設定ファイル：
- `backend/build.gradle.kts` → `java { toolchain { languageVersion = JavaLanguageVersion.of(25) } }`
- `backend/gradle.properties` → `org.gradle.java.installations.paths=D:\\`

---

## 4. 利用環境の制約

| 項目 | 内容 |
|------|------|
| 対応ブラウザ | Google Chrome（最新版）・Microsoft Edge（最新版） |
| 推奨画面サイズ | 横幅1280px以上のパソコン画面 |
| 利用環境 | ローカル環境での動作（社内サーバーまたは開発用PC） |
| データの保持 | サーバーを停止してもデータは消えません |
| フロントエンド起動ポート | http://localhost:5173 |
| バックエンド起動ポート | http://localhost:8080 |
