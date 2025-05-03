import { type DB, createDb } from "@galleo/db";
import { createMiddleware } from "hono/factory";
import { env } from "./env";

export type HonoEnv = {
  Variables: {
    db: DB;
  };
};

export const dbContext = createMiddleware<HonoEnv>(async (c, next) => {
  const db = createDb(env().DATABASE_URL);
  c.set("db", db);
  await next();
});
