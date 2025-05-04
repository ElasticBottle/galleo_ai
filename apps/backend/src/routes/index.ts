import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";
import { showRoutes } from "hono/dev";
import { dbContext } from "../lib/hono";
import { authRouter } from "./api/auth/[...route]";
import { chatRouter } from "./api/chat/route";

export const app = new Hono()
  .use(contextStorage())
  .use(dbContext)
  .route("/", authRouter)
  .route("/", chatRouter);

showRoutes(app, {
  verbose: true,
});

export type AppType = typeof app;
