# 快速部署指南

本專案支援多種部署方式，以下是最快速的方法。

## 🚀 方法一：Vercel 部署（推薦）

### 步驟 1：推送到 GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kol-ad-reviewer.git
git push -u origin main
```

### 步驟 2：在 Vercel 部署
1. 前往 [vercel.com](https://vercel.com) 並登入
2. 點擊 **New Project**
3. 選擇你的 GitHub repository
4. 設定環境變數：
   - `DATABASE_URL` - PostgreSQL 連線字串
   - `OPENAI_API_KEY` - OpenAI API 金鑰（選填）
5. 點擊 **Deploy**

### 預估時間：5 分鐘

---

## 🐳 方法二：Docker 部署

### 建立 Dockerfile
```dockerfile
FROM node:20-alpine AS base

# 安裝依賴
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 建構
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 產品化
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### 執行
```bash
docker build -t kol-ad-reviewer .
docker run -p 3000:3000 kol-ad-reviewer
```

---

## 🗄️ 資料庫設定

### 選項 A：Supabase（免費）
1. 前往 [supabase.com](https://supabase.com) 建立專案
2. 複製 **Connection string** (PostgreSQL)
3. 設定為 `DATABASE_URL` 環境變數

### 選項 B：Neon（免費）
1. 前往 [neon.tech](https://neon.tech) 建立專案
2. 複製連線字串
3. 設定為 `DATABASE_URL` 環境變數

### 初始化資料庫
```bash
npx prisma db push
```

---

## ⚙️ 環境變數

在 `.env` 或部署平台設定：

```env
# 必要
DATABASE_URL="postgresql://user:password@host:5432/database"

# 選填 (啟用 AI 審核)
OPENAI_API_KEY="sk-..."
```

---

## 📋 部署檢查清單

- [ ] 推送程式碼到 GitHub
- [ ] 在 Vercel/Railway 建立專案
- [ ] 設定 PostgreSQL 資料庫
- [ ] 設定環境變數
- [ ] 執行資料庫遷移
- [ ] 測試 API 端點
- [ ] 設定自訂網域（選填）

---

## 🔗 推薦平台

| 平台 | 類型 | 免費額度 |
|------|------|----------|
| [Vercel](https://vercel.com) | 前端 + API | 無限 |
| [Supabase](https://supabase.com) | PostgreSQL | 500MB |
| [Neon](https://neon.tech) | PostgreSQL | 512MB |
| [Railway](https://railway.app) | 全端 | $5/月 |

---

## 💡 快速部署命令

一鍵部署到 Vercel：
```bash
npx vercel
```

需要先安裝 Vercel CLI：
```bash
npm i -g vercel
```
