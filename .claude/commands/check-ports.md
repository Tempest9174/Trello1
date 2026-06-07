このプロジェクトで使用するポートを確認し、競合しているプロセスがあれば自動で停止してください。

## チェック・停止対象ポート

| サービス | ポート | 自動停止 |
|---------|--------|---------|
| バックエンド（Spring Boot） | 8080 | ✅ する |
| フロントエンド（Vite） | 5173 | ✅ する |
| PostgreSQL（ホスト側） | 5433 | ❌ しない（Docker管理） |
| pgAdmin | 5050 | ❌ しない（Docker管理） |

## 手順

PowerShell で各ポートを確認し、8080・5173 が使用中なら即座に停止する：

```powershell
# 8080 の確認・停止
$p8080 = (Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue).OwningProcess | Select-Object -First 1
if ($p8080) { Stop-Process -Id $p8080 -Force; Write-Host "8080を停止: PID $p8080" }

# 5173 の確認・停止
$p5173 = (Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue).OwningProcess | Select-Object -First 1
if ($p5173) { Stop-Process -Id $p5173 -Force; Write-Host "5173を停止: PID $p5173" }

# 5433・5050 は確認のみ（停止しない）
$p5433 = (Get-NetTCPConnection -LocalPort 5433 -ErrorAction SilentlyContinue).OwningProcess | Select-Object -First 1
$p5050 = (Get-NetTCPConnection -LocalPort 5050 -ErrorAction SilentlyContinue).OwningProcess | Select-Object -First 1
```

## 結果の報告形式

```
✅ 8080（バックエンド）: 空き（起動OK）
✅ 5173（フロントエンド）: 空き（起動OK）
✅ 5433（PostgreSQL）: Docker稼働中（正常）
✅ 5050（pgAdmin）: Docker稼働中（正常）
```

停止を行った場合は以下も追記する：
```
🔧 8080: PID <番号> を停止しました → 空きになりました
```

## 注意事項

- 停止対象が Docker や重要なシステムプロセスの場合はユーザーに確認してから停止すること
- 5433・5050 は絶対に停止しないこと
