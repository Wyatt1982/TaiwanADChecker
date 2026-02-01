# 部署指南 Setup Guide

您的專案已經準備好可以部署了！由於這是使用 Next.js 建置的專案，我們強烈建議使用 **Vercel** 進行部署，這是最簡單且效能最好的方式。

## 🔹 方法一：使用 Vercel 網站 (推薦)

最標準的做法是將程式碼推送到 GitHub，然後連接 Vercel。

### 步驟 1：推送到 GitHub
如果您還沒有建立 GitHub Repository，請先建立一個，然後執行：

```bash
git remote add origin <您的-repo-url>
git branch -M main
git push -u origin main
```

*(注意：我們剛剛已經幫您執行了 `git commit`，您目前的修改都已保存)*

### 步驟 2：在 Vercel 匯入專案
1.前往 [Vercel Dashboard](https://vercel.com/dashboard)
2.點擊 **"Add New..."** -> **"Project"**
3.選擇您剛剛推送的 GitHub Repository
4.點擊 **"Import"**

### 步驟 3：設定環境變數 (Environment Variables)
在部署頁面的 **"Environment Variables"** 區塊，請務必新增以下變數（這非常重要，否則 AI 功能無法運作）：

| 變數名稱 (Name) | 值 (Value) | 說明 |
|---|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | `AIzaSy...` (您的 Key) | 用於 AI 審核功能 |
| `DATABASE_URL` | `postgresql://...:6543/postgres?pgbouncer=true` | Supabase Transaction Pooler 連線 |
| `DIRECT_URL` | `postgresql://...:5432/postgres` | Supabase Session Pooler 連線 |

*(您可以參考專案根目錄下的 `.env` 檔案複製這些值)*

### 步驟 4：完成部署
點擊 **"Deploy"**，等待約 1-2 分鐘，您的網站就會上線了！🎉

---

## 🔹 方法二：使用 Vercel CLI (快速測試)

如果您不想經過 GitHub，也可以直接從電腦上傳部署：

1.在終端機執行：
```bash
npx vercel
```

2.依照螢幕指示操作：
   - Set up and deploy? **Yes**
   - Which scope? (選擇您的帳號)
   - Link to existing project? **No**
   - Project name? (按 Enter 使用預設)
   - In which directory? (按 Enter)

3.部署完成後，CLI 會給您一個網址 (例如: `https://ad-check-helper.vercel.app`)

4.**重要**：部署後，請記得到 Vercel 網站該專案的 **Settings > Environment Variables** 補上 API Key，然後重新 Redeploy。

---

## 💡 注意事項

- **資料庫連線**：我們已經設定好 Supabase 的 Connection Pooling，這對 Serverless 環境（如 Vercel）非常重要，可以避免連線數耗盡。
- **冷啟動**：免費版 Vercel 可能會有冷啟動延遲，這是正常的。
- **後台管理**：上線後，您可以在網址後加上 `/admin` 進入管理後台 (例如: `https://your-site.vercel.app/admin`)。
