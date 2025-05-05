import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { dbContext } from "../lib/hono";
import { authRouter } from "./api/auth/[...route]";
import { chatRouter } from "./api/chat/route";
import { feeQuoteRouter } from "./api/fee-quote/route";

export const app = new Hono()
  .use(logger())
  .use(contextStorage())
  .use(dbContext)
  .route("/", authRouter)
  .route("/", chatRouter)
  .route("/", feeQuoteRouter);

showRoutes(app, {
  verbose: true,
});

export type AppType = typeof app;
