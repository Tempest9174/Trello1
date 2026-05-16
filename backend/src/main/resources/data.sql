INSERT INTO boards (title, position) VALUES ('プロジェクト管理ボード', 1);

INSERT INTO lists (board_id, title, position) VALUES (1, '未着手', 1);
INSERT INTO lists (board_id, title, position) VALUES (1, '進行中', 2);

INSERT INTO cards (list_id, title, description, due_date, priority, position)
VALUES (1, 'ログイン機能の実装', 'ユーザー認証画面とAPIエンドポイントを作成する', '2026-05-30', 'HIGH', 1);

INSERT INTO cards (list_id, title, description, due_date, priority, position)
VALUES (1, 'DB設計のレビュー', 'ER図をチームでレビューして確定させる', '2026-05-20', 'MEDIUM', 2);

INSERT INTO cards (list_id, title, description, due_date, priority, position)
VALUES (2, 'フロントエンド環境構築', 'React + Vite のセットアップとルーティング設定', '2026-05-18', 'HIGH', 1);
