import { ensureSession } from "~/lib/server/auth";
import { ChatInterface } from "./_components/chat";

export default async function ChatPage() {
  await ensureSession();
  return <ChatInterface />;
}
