import { safe } from "@rectangular-labs/result";
import { redirect } from "next/navigation";
import { ROUTE_DASHBOARD_TEAM } from "../routes";
import { getApi } from "./api";

export async function getSession() {
  const serverApi = await getApi();
  const response = await safe(() => serverApi.auth.getSession());
  if (!response.ok) {
    return { userSubject: null, session: null };
  }
  return response.value;
}
export type Session = Awaited<ReturnType<typeof getSession>>;

export async function ensureSession(teamId?: number) {
  const session = await getSession();
  if (!session.userSubject) {
    const serverApi = await getApi();
    const response = await safe(() => serverApi.auth.authorize());
    if (!response.ok) {
      console.error("Failed to get authorize url", response.error);
      throw new Error("Failed to get authorize url");
    }
    const redirectUrl = response.value.redirectUrl;
    throw redirect(redirectUrl);
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
