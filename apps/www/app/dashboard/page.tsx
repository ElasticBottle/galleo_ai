import { redirect } from "next/navigation";
import { ROUTE_DASHBOARD_TEAM } from "~/lib/routes";
import { ensureSession } from "~/lib/server/auth";

export default async function Dashboard() {
  const session = await ensureSession();
  redirect(ROUTE_DASHBOARD_TEAM(session.session.team.id));
}
