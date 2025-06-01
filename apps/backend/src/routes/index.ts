import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { dbContext } from "../lib/hono";
import { chatRouter } from "./api/[teamId]/chat/[...route]";
import { fileRouter } from "./api/[teamId]/file/[...route]";
import { authRouter } from "./api/auth/[...route]";
import { feeQuoteRouter } from "./api/fee-quote/route";

export const app = new Hono()
  .use(logger())
  .use(contextStorage())
  .use(dbContext)
  .route("/", authRouter)
  .route("/", chatRouter)
  .route("/", fileRouter)
  .route("/", feeQuoteRouter);

showRoutes(app, {
  verbose: true,
});

export type AppType = typeof app;
