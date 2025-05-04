import { redirect } from "next/navigation";
import { ROUTE_DASHBOARD } from "~/lib/routes";
import { ensureSession } from "~/lib/server/auth";

export default async function Dashboard() {
  const session = await ensureSession();
  redirect(ROUTE_DASHBOARD(session.session.team.id));
}
