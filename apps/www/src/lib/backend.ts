import type { AppType } from "@galleo/backend";
import { hc } from "hono/client";
import { env } from "./env";

export const backend = hc<AppType>(env.VITE_APP_URL);
