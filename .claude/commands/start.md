フロントエンドまたはバックエンド（あるいは両方）を起動してください。

## 引数

- 引数なし → フロントエンドとバックエンドの両方を起動
- `frontend` → フロントエンドのみ起動
- `backend` → バックエンドのみ起動

## 手順

### Step 1: 対象ポートのプロセスを確認・停止

起動前に必ず対象ポートを解放すること。ポートが使用中であれば **必ずそのプロセスを停止してからデフォルトポートで起動する**。別のポートに切り替えることは禁止。

**バックエンド（8080）を起動する場合:**
```powershell
$pid8080 = (Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue).OwningProcess | Select-Object -First 1
if ($pid8080) { Stop-Process -Id $pid8080 -Force; Write-Host "ポート8080のプロセス($pid8080)を停止しました" }
```

**フロントエンド（5173）を起動する場合:**
```powershell
$pid5173 = (Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue).OwningProcess | Select-Object -First 1
if ($pid5173) { Stop-Process -Id $pid5173 -Force; Write-Host "ポート5173のプロセス($pid5173)を停止しました" }
```

### Step 2: サーバーを起動

**バックエンド:**
```powershell
Set-Location 'd:\Cursor\TaskManagement\backend'
& '.\gradlew.bat' bootRun
```
バックグラウンド起動後、ログに `Started TaskManagementApplication` が出るまで待機して確認する。

**フロントエンド:**
```powershell
Set-Location 'd:\Cursor\TaskManagement\frontend'
npm run dev
```
バックグラウンド起動後、ログに `Local: http://localhost:5173` が出るまで待機して確認する。

### Step 3: 結果を日本語で報告

```
✅ バックエンド: http://localhost:8080 で起動しました
✅ フロントエンド: http://localhost:5173 で起動しました
```

## 注意事項

- ポート競合時は **必ずデフォルトポートで起動する**。別ポートへの変更は禁止
- PostgreSQL（5433）・pgAdmin（5050）は Docker が管理するため停止しないこと
- 停止したプロセスが Docker や重要なシステムプロセスの場合は停止せずユーザーに確認すること
