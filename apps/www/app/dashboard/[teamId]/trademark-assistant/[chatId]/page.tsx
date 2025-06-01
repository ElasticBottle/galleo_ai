import { ChatInterface } from "../_components/chat"; // Adjusted import path

export default async function ChatInstancePage({
  params,
}: {
  params: Promise<{ teamId: string; chatId: string }>;
}) {
  const { teamId, chatId } = await params;
  return <ChatInterface teamId={teamId} chatId={chatId} initialMessages={[]} />;
}
