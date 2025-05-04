import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}
console.log("DATABASE_URL", process.env.DATABASE_URL);

export default {
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  schema: "./src/schema/*",
  out: "./migrations",
  breakpoints: true,
  verbose: true,
  strict: true,
  casing: "snake_case",
  tablesFilter: "ra_*",
} satisfies Config;
