# KOL Ad Review Helper (AI 快審通)

> **🤖 For AI Agents & Cursor**: Please read the **System Architecture & Key Decisions** section carefully before making changes.

## 🌟 Project Overview

**KOL Ad Review Helper** is a Next.js application designed to streamline the workflow between Brands and KOLs (Key Opinion Leaders). It acts as an AI-powered compliance assistant, checking ad content against local regulations using Generative AI.

## 🛠 System Architecture (Critical Context)

### 1. Database & ORM (PostgreSQL + Prisma Adapter)
*   **Provider**: Supabase (PostgreSQL)
*   **Connection Strategy**: **MUST** use `@prisma/adapter-pg` with `pg` driver (PostgreSQL) to support Vercel Serverless environment.
    *   **Reason**: Standard Prisma Client exhausts connection limits in serverless.
    *   **Ref**: `src/lib/prisma.ts` (Adapter Implementation).
    *   **Schema**: `prisma/schema.prisma` (`engineType = "library"`).

### 2. Authentication (Mock / Client-Side)
*   **Current State**: **Mock Implementation** using `localStorage`.
    *   **Ref**: `src/data/auth.ts` contains the mock logic and test accounts.
    *   There is NO server-side session validation in `src/app/api` currently.
*   **Future Goal**: Migrate to NextAuth (packages already installed).

### 3. AI Analysis Logic
*   **Core Service**: `src/services/analyzer.ts`
    *   **Provider**: Google Gemini (`google('gemini-2.0-flash')`) via Vercel AI SDK.
    *   **Fallback**: Includes a regex-based `mockAnalyzeContent` for local dev without keys.
*   **API Endpoint**: `src/app/api/review/route.ts`

### 4. System Settings (Global Config)
*   **Storage**: Database-backed `SystemSetting` table (Key-Value JSON).
*   **Access**: Server Actions in `src/app/actions/settings.ts`.
    *   **Convention**: Use `getSystemStatus()` to read and `updateSystemStatusAction()` to write.
    *   **Cache**: Updates trigger `revalidatePath` for immediate propagation.

---

## 🚀 Getting Started

### 1. Environment Setup (`.env`)
Create a `.env` file in the root directory:

```env
# Supabase Transaction Pooler (Port 6543) - Application Connection
DATABASE_URL="postgresql://postgres.[user]:[password]@[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase Session Pooler (Port 5432) - Migrations (Direct)
DIRECT_URL="postgresql://postgres.[user]:[password]@[region].pooler.supabase.com:5432/postgres"

# AI Provider Key
GOOGLE_GENERATIVE_AI_API_KEY="AIzaSy..."
```

### 2. Installation & Run

```bash
# Install dependencies
npm install

# Generate Prisma Client (CRITICAL STEP)
# Must run this whenever schema changes or after install
npx prisma generate

# Start Dev Server
npm run dev
```

---

## 📦 Deployment (Vercel)

*   **Build Command**: The `package.json` has a `postinstall` script (`prisma generate`) to ensure client generation on Vercel.
*   **Environment Variables**: Ensure `DATABASE_URL`, `DIRECT_URL`, and `GOOGLE_GENERATIVE_AI_API_KEY` are set in Vercel Project Settings.

---

## 🔧 Maintenance & Troubleshooting

### Common Issues
*   **"PrismaClientInitializationError: ... engine type 'client' requires ..."**
    *   **Fix**: You are likely missing the `adapter` config. Check `src/lib/prisma.ts`.
*   **"Repository not found" (Git Push)**
    *   **Fix**: Check if the repo exists on GitHub. If private, ensure your PAT (Personal Access Token) has `repo` AND `workflow` scopes.

### Folder Structure
*   `src/app/(admin)`: Admin dashboard pages.
*   `src/app/actions`: Server Actions (Backend Logic).
*   `src/services`: Business logic (AI, Analysis).
*   `src/data`: Mock data and types.
*   `prisma`: DB Schema and migrations.
