import { app } from "@galleo/backend/app";
import { handle } from "hono/vercel";

// This is used for local development only
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
