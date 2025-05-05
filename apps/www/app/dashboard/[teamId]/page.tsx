import { redirect } from "next/navigation";
import { ROUTE_TRADEMARK_ASSISTANT } from "~/lib/routes";
import { ensureSession } from "~/lib/server/auth";

export default async function Dashboard({
  params,
}: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  await ensureSession(Number.parseInt(teamId));

  redirect(ROUTE_TRADEMARK_ASSISTANT(Number.parseInt(teamId)));
}
