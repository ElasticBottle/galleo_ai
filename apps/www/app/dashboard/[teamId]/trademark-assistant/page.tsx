import { ChatInterface } from "./_components/chat";

export default async function ChatInstancePage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  return <ChatInterface teamId={teamId} initialMessages={[]} />;
}
