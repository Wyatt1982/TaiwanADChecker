// AI 快審通 - Prisma 7 Configuration
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // 使用 DIRECT_URL 繞過 PgBouncer (migrations 需要)
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});

