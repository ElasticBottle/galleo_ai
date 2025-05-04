import { safe } from "@rectangular-labs/result";
import { redirect } from "next/navigation";
import { backend as clientBackend } from "../client/backend";
import { backend } from "./backend";

export async function getSession() {
  const serverApi = await backend();
  const response = await safe(() => serverApi.api.auth.me.$get());
  if (!response.ok || !response.value.ok) {
    return { userSubject: null, session: null };
  }
  const session = await response.value.json();
  return { userSubject: session.userSubject, session: session.session };
}

export type Session = Awaited<ReturnType<typeof getSession>>;
export async function ensureSession() {
  const session = await getSession();
  if (!session.userSubject) {
    throw redirect(authorizeUrl);
  }
  return session;
}

export const authorizeUrl = clientBackend.api.auth.authorize.$url().href;
