# 定期更新機制

本專案設定了自動化的定期更新機制，確保食藥署案例資料保持最新。

## 📅 自動更新排程

### 1. 食藥署案例更新（每週一）

**檔案**: `.github/workflows/update-fda-cases.yml`

**執行時間**: 每週一 09:00 (UTC+8)

**功能**:
- 自動執行 `scripts/scrape-fda-cases.ts` 爬蟲腳本
- 檢查是否有新案例
- 如有更新，自動提交至 Git 倉庫

**手動觸發**:
- GitHub Actions 頁面 → 選擇 workflow → Run workflow

---

### 2. 每日健康檢查

**檔案**: `.github/workflows/daily-health-check.yml`

**執行時間**: 每天 09:00 (UTC+8)

**功能**:
- 檢查專案是否能正常建置
- 執行 TypeScript 型別檢查
- 確認食藥署網站可訪問

---

## 🖥️ 本地手動更新

如需手動更新案例資料：

```bash
# 使用 npm script
npm run update-cases

# 或直接執行
npx tsx scripts/scrape-fda-cases.ts
```

---

## ⚙️ 設定 GitHub Actions

1. 確保專案已推送至 GitHub
2. 前往 Repository → Settings → Actions
3. 確認 Actions 權限已開啟
4. Workflow 會自動按排程執行

### 必要權限

確保 GitHub Actions 有寫入權限：
- Settings → Actions → General
- Workflow permissions → Read and write permissions

---

## 📊 監控更新狀態

1. 前往 GitHub → Actions 頁籤
2. 查看各 workflow 的執行紀錄
3. 點擊 Summary 查看更新摘要

---

## 🔧 自訂排程時間

修改 `.github/workflows/update-fda-cases.yml` 中的 cron 表達式：

```yaml
schedule:
  - cron: '0 1 * * 1'  # 每週一 UTC 01:00 (即 UTC+8 09:00)
```

**Cron 格式**: `分 時 日 月 週幾`

範例：
- `'0 1 * * *'` - 每天 09:00 (UTC+8)
- `'0 1 * * 1,4'` - 每週一、四 09:00 (UTC+8)
- `'0 1 1 * *'` - 每月 1 號 09:00 (UTC+8)
