import { ChatInterface } from "./_components/chat";

export default function Dashboard({
  params: _,
}: { params: Promise<{ teamId: string }> }) {
  return <ChatInterface />;
}
