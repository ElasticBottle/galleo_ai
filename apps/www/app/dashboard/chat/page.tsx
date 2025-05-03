import { ensureSession } from "~/lib/auth";
import { ChatInterface } from "./client";

export default async function ChatPage() {
  await ensureSession();
  return <ChatInterface />;
}
