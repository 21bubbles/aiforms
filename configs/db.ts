import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

// Use the database URL from environment variables
const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);

// Export the db object for use in your application
export const db = drizzle(sql);
