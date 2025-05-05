import { safe } from "@rectangular-labs/result";
import { redirect } from "next/navigation";
import { backend as clientBackend } from "../client/backend";
import { ROUTE_DASHBOARD_TEAM } from "../routes";
import { backend } from "./backend";

export async function getSession() {
  const serverApi = await backend();
  const response = await safe(() => serverApi.api.auth.me.$get());
  if (!response.ok || !response.value.ok) {
    return { userSubject: null, session: null };
  }
  const session = await response.value.json();
  console.log("session", session);
  return { userSubject: session.userSubject, session: session.session };
}

export type Session = Awaited<ReturnType<typeof getSession>>;
export async function ensureSession(teamId?: number) {
  const session = await getSession();
  if (!session.userSubject) {
    throw redirect(authorizeUrl);
  }

  if (typeof teamId !== "number") {
    return session;
  }

  const defaultTeamId = session.session.teamRoles[0]?.teamId;
  if (typeof defaultTeamId !== "number") {
    console.error("No default team found for user", session.userSubject);
    throw new Error("No default team found");
  }
  const teamRole = session.session.teamRoles.find(
    (role) => role.teamId === teamId,
  );
  if (!teamRole) {
    throw redirect(ROUTE_DASHBOARD_TEAM(defaultTeamId));
  }

  return session;
}

export const authorizeUrl = clientBackend.api.auth.authorize.$url().href;
