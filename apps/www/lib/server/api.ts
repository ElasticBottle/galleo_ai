import { app } from "@galleo/backend";
import { parseServerEnv } from "@galleo/env";
import { createRouterClient } from "@orpc/server";
import { cookies } from "next/headers";

export const getApi = async () =>
  createRouterClient(app, {
    context: {
      env: parseServerEnv(process.env),
      cookies: await cookies(),
    },
  });
