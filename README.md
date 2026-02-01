# KOL Ad Review Helper (AI 快審通)

> **For AI Agents / Cursor / Developers**: Please read the **System Architecture & Key Decisions** section carefully before making changes to database connections or deployment configurations.

## Project Overview

KOL Ad Review Helper is a Next.js application designed to streamline the workflow between Brands and KOLs (Key Opinion Leaders). It features an AI-powered ad content review system, a Jobs board, and a KOL database.

### Core Features

*   **AI Review**: Automatically analyzes ad content against compliance regulations (FDA, local laws) using Google Gemini AI.
*   **Admin Dashboard**: Manage global system settings (maintenance mode, feature flags) via a database-backed configuration.
*   **Jobs Board**: Platform for brands to post collaboration opportunities.
*   **KOL Database**: Searchable database of influencers.

## Tech Stack

*   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
*   **Language**: TypeScript
*   **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
*   **ORM**: [Prisma](https://www.prisma.io/)
*   **AI**: [AI SDK](https://sdk.vercel.ai/) (integrating Google Gemini)
*   **Deployment**: [Vercel](https://vercel.com/)

---

## 🛠 System Architecture & Key Decisions (CRITICAL)

### 1. Database Connection (Serverless Compatibility)
This project is deployed on Vercel (Serverless). Standard Prisma connections can exhaust the database connection limit.
*   **Solution**: We use `@prisma/adapter-pg` with the `pg` driver (PostgreSQL) to manage connections efficiently via connection pooling.
*   **File**: `src/lib/prisma.ts` demonstrates the adapter implementation.
*   **Schema**: `prisma/schema.prisma` uses `engineType = "library"`.

### 2. System Settings (Global Config)
*   **Old Behavior**: Used `localStorage` (Client-side only).
*   **New Behavior**: Uses a dedicated `SystemSetting` table in Supabase.
    *   **Model**: `key` (Unique ID), `value` (JSON).
    *   **Access**: Server Actions (`src/app/actions/settings.ts`) handle reading/writing.
    *   **Caching**: Updates trigger `revalidatePath` to ensure instant global propagation.

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
*   Node.js 18+
*   npm
*   A Supabase project

### 2. Environment Variables
Create a `.env` file in the root directory:

```env
# Supabase Transaction Pooler (Port 6543) - For Application
DATABASE_URL="postgresql://postgres.[user]:[password]@[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase Session Pooler (Port 5432) - For Migrations (Direct)
DIRECT_URL="postgresql://postgres.[user]:[password]@[region].pooler.supabase.com:5432/postgres"

# AI Provider
GOOGLE_GENERATIVE_AI_API_KEY="AIzaSy..."
```

### 3. Install & Run

```bash
# Install dependencies
npm install

# Generate Prisma Client (REQUIRED after install)
npx prisma generate

# Run development server
npm run dev
```

Visit `http://localhost:3000`.

---

## 📦 Deployment (Vercel)

### 1. Build Command
The `package.json` includes a `postinstall` script:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```
This ensures the Prisma Client is generated during the Vercel build process.

### 2. Environment Variables
You MUST set the following in Vercel Project Settings:
*   `DATABASE_URL`
*   `DIRECT_URL`
*   `GOOGLE_GENERATIVE_AI_API_KEY`

### 3. Deploy
```bash
npx vercel --prod
```

---

## 🔧 Maintenance Guide

### Updating Database Schema
1.  Modify `prisma/schema.prisma`.
2.  Push changes to DB:
    ```bash
    npx prisma db push
    ```
3.  Regenerate client:
    ```bash
    npx prisma generate
    ```

### Troubleshooting
*   **Error**: `PrismaClientInitializationError: ... engine type "client" requires ...`
    *   **Fix**: Ensure you are using the `adapter` pattern in `src/lib/prisma.ts` and have `@prisma/adapter-pg` installed.
*   **Error**: `Vercel Build Failed`
    *   **Fix**: Check if `postinstall` script exists in `package.json`. Check if ENV variables are set in Vercel.

---

## 📂 Project Structure

```
├── prisma/
│   ├── schema.prisma    # Database Schema
├── src/
│   ├── app/
│   │   ├── actions/     # Server Actions (Backend Logic)
│   │   ├── admin/       # Admin Dashboard
│   │   ├── jobs/        # Jobs Feature
│   │   ├── kols/        # KOL Database Feature
│   │   ├── api/         # API Routes (Legacy/Special use)
│   ├── components/      # React Components
│   ├── data/            # Mock Data & Types
│   ├── lib/             # Utilities (Prisma Client, etc.)
├── package.json
└── next.config.ts
```
