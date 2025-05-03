import { safe } from "@rectangular-labs/result";
import { redirect } from "next/navigation";
import { backend } from "./backend";

export async function getSession() {
  const response = await safe(() => backend.api.auth.me.$get());
  if (!response.ok || !response.value.ok) {
    return { user: null };
  }
  const session = await response.value.json();
  return { user: session.properties };
}

export async function ensureSession() {
  const session = await getSession();
  if (!session.user) {
    redirect(authorizeUrl);
  }
}

export const authorizeUrl = backend.api.auth.authorize.$url().href;
