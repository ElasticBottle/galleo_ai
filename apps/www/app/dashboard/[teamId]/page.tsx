import { redirect } from "next/navigation";
import { ROUTE_TRADEMARK_ASSISTANT } from "~/lib/routes";

export default async function Dashboard({
  params,
}: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  console.log("typeof teamId", typeof teamId);
  redirect(ROUTE_TRADEMARK_ASSISTANT(Number.parseInt(teamId)));
}
