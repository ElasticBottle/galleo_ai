import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";
import { showRoutes } from "hono/dev";
import { dbContext } from "../lib/hono";
import { apiRouter } from "./api/route";

export const app = new Hono()
  .use(contextStorage())
  .use(dbContext)
  .route("/api", apiRouter);

showRoutes(app, {
  verbose: true,
});

export type AppType = typeof app;
