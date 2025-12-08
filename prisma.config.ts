import path from "path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// ⭐ Load .env from backend root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// ⭐ Check DATABASE_URL exists or not
if (!process.env.DATABASE_URL) {
  console.warn(
    "\x1b[33m[Prisma Warning]\x1b[0m DATABASE_URL is missing!\n" +
      "→ Make sure your .env is placed at: backend-system/.env\n"
  );
} else {
  console.log("\x1b[32m[Prisma]\x1b[0m DATABASE_URL loaded successfully.");
}

// ⭐ Prisma configuration
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic", // default Prisma engine
  datasource: {
    url: process.env.DATABASE_URL || "",
  },
});
