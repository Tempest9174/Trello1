# 開発スケジュール

---

## フェーズ1：バックエンド構築

データの保存・取得・更新・削除の基本機能を構築します。

| ステップ | 内容 | 状態 |
|---------|------|------|
| Step 1 | データベース設計・構築（tasksテーブル） | ✅ 完了 |
| Step 2 | タスク一覧取得API（GET /api/tasks） | ✅ 完了 |
| Step 3 | タスク作成API（POST /api/tasks） | ✅ 完了 |
| Step 4 | タスク更新API（PUT /api/tasks/{id}） | ✅ 完了 |
| Step 5 | タスク削除API（DELETE /api/tasks/{id}） | ✅ 完了 |
| Step 6 | エラー処理の整備（GlobalExceptionHandler） | ✅ 完了 |

---

## フェーズ2：フロントエンド構築

ユーザーが操作する画面を構築し、フェーズ1のAPIと接続します。

| ステップ | 内容 | 状態 |
|---------|------|------|
| Step 7 | React開発環境のセットアップ（Vite + TypeScript） | ✅ 完了 |
| Step 8 | タスク一覧画面の実装 | ✅ 完了 |
| Step 9 | タスク作成・編集・削除機能の実装 | ✅ 完了 |
| Step 10 | 総合動作確認 | ✅ 完了 |

---

## フェーズ3：品質・運用整備

スケジュール策定時点では計画外だったが、実務水準に近づけるために実施した追加作業。

| ステップ | 内容 | 状態 |
|---------|------|------|
| Step 11 | ドラッグ&ドロップによるステータス変更機能（PATCH /api/tasks/{id}/status） | ✅ 完了 |
| Step 12 | GitHub Actions CI 構築（ESLint・Prettier・Checkstyle・SpotBugs） | ✅ 完了 |
| Step 13 | バリデーション強化（@NotBlank / @Size / @Pattern） | ✅ 完了 |
| Step 14 | @Transactional による トランザクション管理 | ✅ 完了 |
| Step 15 | テスト実装（JUnit5 / Vitest） | 未着手 |
| Step 16 | 依存関係の脆弱性スキャン（npm audit / OWASP Dependency-Check） | 未着手 |
