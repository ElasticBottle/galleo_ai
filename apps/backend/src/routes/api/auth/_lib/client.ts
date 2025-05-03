import { createClient } from "@galleo/auth/client";
import { env } from "../../../../lib/env";

export const authClient = () =>
  createClient({
    clientID: "galleo-backend",
    issuer: env().NEXT_PUBLIC_AUTH_URL,
  });
