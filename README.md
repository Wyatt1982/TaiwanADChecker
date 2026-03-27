# KOL Ad Review Helper (AI 快審通)

> **🤖 給 AI Agents 與 Cursor 的提示**：在進行任何更改之前，請仔細閱讀**系統架構與關鍵決策 (System Architecture & Key Decisions)**章節。

## 🌟 專案概述

**KOL Ad Review Helper (AI 快審通)** 是一個 Next.js 應用程式，旨在簡化品牌與 KOL (關鍵意見領袖) 之間的工作流程。它作為一個 AI 驅動的合規助手，利用生成式 AI 根據當地法規檢查廣告內容。

## 🛠 系統架構 (關鍵背景)

### 1. 資料庫與 ORM (PostgreSQL + Prisma Adapter)
*   **提供者**: Supabase (PostgreSQL)
*   **連線策略**: **必須**使用 `@prisma/adapter-pg` 搭配 `pg` 驅動程式 (PostgreSQL) 以支援 Vercel Serverless 環境。
    *   **原因**: 標準 Prisma Client 在 Serverless 環境中會耗盡連線數限制。
    *   **參考**: `src/lib/prisma.ts` (Adapter 實作)。
    *   **Schema**: `prisma/schema.prisma` (`engineType = "library"`)。

### 2. 身份驗證 (Mock / 客戶端)
*   **目前狀態**: 使用 `localStorage` 的 **Mock 實作**。
    *   **參考**: `src/data/auth.ts` 包含 Mock 邏輯與測試帳號。
    *   目前 `src/app/api` 中**沒有**伺服器端的 Session 驗證。
*   **未來目標**: 遷移至 NextAuth (套件已安裝)。

### 3. AI 分析邏輯
*   **核心服務**: `src/services/analyzer.ts`
    *   **提供者**: 透過 Vercel AI SDK 使用 Google Gemini (`google('gemini-2.0-flash')`)。
    *   **備援機制**: 包含基於 Regex 的 `mockAnalyzeContent`，供本地開發在無 API Key 時使用。
*   **API 端點**: `src/app/api/review/route.ts`

### 4. 系統設定 (全域設定)
*   **儲存**: 資料庫驅動的 `SystemSetting` 表 (Key-Value JSON)。
*   **存取**: `src/app/actions/settings.ts` 中的 Server Actions。
    *   **慣例**: 使用 `getSystemStatus()` 讀取，使用 `updateSystemStatusAction()` 寫入。
    *   **快取**: 更新會觸發 `revalidatePath` 以立即生效。

---

## 🚀 開始使用

### 1. 環境設定 (`.env`)
在根目錄建立 `.env` 檔案：

```env
# Supabase Transaction Pooler (Port 6543) - 應用程式連線
DATABASE_URL="postgresql://postgres.[user]:[password]@[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase Session Pooler (Port 5432) - 遷移 (直接連線)
DIRECT_URL="postgresql://postgres.[user]:[password]@[region].pooler.supabase.com:5432/postgres"

# AI Provider Key
GOOGLE_GENERATIVE_AI_API_KEY="AIzaSy..."
```

### 2. 安裝與執行

```bash
# 安裝依賴套件
npm install

# 產生 Prisma Client (關鍵步驟)
# 每次 schema 變更或安裝後都必須執行此步驟
npx prisma generate

# 啟動開發伺服器
npm run dev
```

---

## 📦 部署 (Vercel)

*   **建置指令**: `package.json` 有設定 `postinstall` 腳本 (`prisma generate`) 以確保在 Vercel 上產生 Client。
*   **環境變數**: 請確保 `DATABASE_URL`、`DIRECT_URL` 和 `GOOGLE_GENERATIVE_AI_API_KEY` 已在 Vercel 專案設定中設定。

---

## 🔧 維護與疑難排解

### 常見問題
*   **"PrismaClientInitializationError: ... engine type 'client' requires ..."**
    *   **解決方法**: 您可能缺少 `adapter` 設定。請檢查 `src/lib/prisma.ts`。
*   **"Repository not found" (Git Push)**
    *   **解決方法**: 檢查 GitHub 上是否存在該 repo。如果是私有的，請確保您的 PAT (Personal Access Token) 具有 `repo` 和 `workflow` 權限。

### 資料夾結構
*   `src/app/(admin)`: 後台管理頁面。
*   `src/app/actions`: Server Actions (後端邏輯)。
*   `src/services`: 商業邏輯 (AI、分析)。
*   `src/data`: Mock 資料與型別。
*   `prisma`: DB Schema 與遷移檔。
