import { handle, streamHandle } from "hono/aws-lambda";
import { app } from "./routes/route";

export const handler: unknown = process.env.SST_LIVE
  ? handle(app)
  : streamHandle(app);
