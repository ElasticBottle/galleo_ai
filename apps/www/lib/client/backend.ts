import { hc } from "hono/client";
import type { AppType } from "next/app";
import { env } from "../env";

export const backend = hc<AppType>(env.NEXT_PUBLIC_APP_URL, {
  init: {
    credentials: "include",
  },
});

const link = new RPCLink({
  url: "http://127.0.0.1:3000",
  headers: { Authorization: "Bearer token" },
});
