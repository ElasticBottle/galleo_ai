import { redirect } from "next/navigation";
import { ROUTE_DASHBOARD_TEAM } from "~/lib/routes";
import { ensureSession } from "~/lib/server/auth";

export default async function Dashboard() {
  const session = await ensureSession();
  const defaultTeamId = session.session.teamRoles[0]?.teamId;
  if (typeof defaultTeamId !== "number") {
    console.error("No default team found for user", session.userSubject);
    throw new Error("No default team found");
  }
  redirect(ROUTE_DASHBOARD_TEAM(defaultTeamId));
}
