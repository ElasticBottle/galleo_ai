import { safe } from "@rectangular-labs/result";
import { redirect } from "next/navigation";
import { backend as clientBackend } from "../client/backend";
import { backend } from "./backend";

export async function getSession() {
  const serverApi = await backend();
  const response = await safe(() => serverApi.api.auth.me.$get());
  console.log("response", response);
  if (!response.ok || !response.value.ok) {
    return { user: null };
  }
  const session = await response.value.json();
  return { user: session.properties };
}

export async function ensureSession() {
  const session = await getSession();
  console.log("session", session);
  if (!session.user) {
    redirect(authorizeUrl);
  }
  return session;
}

export const authorizeUrl = clientBackend.api.auth.authorize.$url().href;
