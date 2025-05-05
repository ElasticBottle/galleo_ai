import { ensureSession } from "~/lib/server/auth";
import { ChatInterface } from "./_components/chat";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  await ensureSession(Number.parseInt(teamId));
  return <ChatInterface />;
}
