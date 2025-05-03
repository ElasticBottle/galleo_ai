import type { AppType } from "@galleo/backend/app";
import { hc } from "hono/client";
import { headers } from "next/headers";
import { env } from "../env";

export const backend = async () => {
  const headersList = await headers();
  return hc<AppType>(env.NEXT_PUBLIC_APP_URL, {
    init: {
      headers: headersList,
    },
  });
};
