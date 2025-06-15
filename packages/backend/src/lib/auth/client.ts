import { createClient } from "@galleo/auth/client";
import { subjects } from "@galleo/auth/subject";
import { getEnv } from "../orpc/routers";
import { setSession } from "./session";

export const authClient = () =>
  createClient({
    clientID: "galleo-backend",
    issuer: getEnv().NEXT_PUBLIC_AUTH_URL,
  });

export async function verifySafe({
  access,
  refresh,
  autoRefresh = true,
}: {
  access: string;
  refresh: string;
  autoRefresh?: boolean;
}) {
  const verified = await authClient().verify(subjects, access, {
    refresh,
  });
  if (verified.err) {
    return {
      ok: false,
      err: verified.err,
    };
  }
  if (autoRefresh && verified.tokens) {
    setSession(verified.tokens.access, verified.tokens.refresh);
  }
  return { ok: true, value: verified.subject };
}
