import { defineConfig } from "drizzle-kit";

const dbUrl = process.env.NEXT_PUBLIC_DATABASE_URL || "postgresql://neondb_owner:fXuykN5UJ9cz@ep-crimson-breeze-a5ksf24b.us-east-2.aws.neon.tech/neondb?sslmode=require"; // Replace with a suitable default value

export default defineConfig({
  schema: "./configs/schema.ts",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  }
});
