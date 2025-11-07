import path from "path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// ✅ Load .env file safely from backend root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// ✅ Log environment variable status
if (!process.env.DATABASE_URL) {
  console.warn(
    "\x1b[33m[Prisma Warning]\x1b[0m DATABASE_URL is not defined.\n" +
      "→ Ensure you have a .env file in your backend root (e.g. D:\\community-platform\\backend-system\\.env)"
  );
} else {
  console.log("\x1b[32m[Prisma]\x1b[0m DATABASE_URL detected successfully.");
}

// ✅ Correct Prisma config (no unsupported properties)
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL || "",
  },
});
