import type { AppType } from "@galleo/backend/app";
import { hc } from "hono/client";
import { env } from "../env";

export const backend = hc<AppType>(env.NEXT_PUBLIC_APP_URL, {
  init: {
    credentials: "include",
  },
});
