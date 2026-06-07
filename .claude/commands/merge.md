現在のブランチを develop へマージし、Issue をクローズして、ブランチを削除してください。

## 手順

以下を順番に実行してください：

### 1. 現在のブランチと PR 番号を確認する

```powershell
git branch --show-current
gh pr list --head $(git branch --show-current) --json number,title,state
```

### 2. Issue 番号をブランチ名から取得する

ブランチ名のパターン: `feature/#<番号>-...` / `fix/#<番号>-...` / `docs/#<番号>-...`
`#` の直後の数字が Issue 番号です。

### 3. PR をマージする（squash マージ・ブランチ削除あり）

```powershell
gh pr merge <PR番号> --squash --delete-branch
```

### 4. Issue を手動クローズする

```powershell
gh issue close <Issue番号>
```

### 5. 結果を日本語で報告する

```
✅ PR #<番号> を develop にマージしました
✅ Issue #<番号> をクローズしました
✅ ブランチ <ブランチ名> を削除しました
```

## 注意事項

- PR が存在しない場合は先に `gh pr create --base develop ...` で作成してからマージすること
- マージ先は必ず `develop`（main への直接マージは禁止）
- ブランチ削除はリモートのみ。ローカルが残っている場合は `git branch -d <ブランチ名>` を案内する
