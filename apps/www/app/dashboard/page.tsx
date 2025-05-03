import { ensureSession } from "~/lib/server/auth";

export default async function Dashboard() {
  await ensureSession();
  return <div>Dashboard</div>;
}
