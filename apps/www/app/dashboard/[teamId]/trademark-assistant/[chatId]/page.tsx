import type { Message } from "@ai-sdk/react";
import { safe } from "@rectangular-labs/result";
import { notFound } from "next/navigation";
import { getApi } from "~/lib/server/api";
import { ChatInterface } from "./_components/chat";

export default async function ChatInstancePage({
  params,
}: {
  params: Promise<{ teamId: string; chatId: string }>;
}) {
  const { teamId, chatId } = await params;
  const api = await getApi();
  const response = await safe(() =>
    api.chat.getChat({
      teamId,
      chatId,
    }),
  );
  if (!response.ok) {
    const error = response.error;
    console.error("Something went wrong fetching chat", error);
    return (
      <div>Something went wrong fetching chat. Please try again later.</div>
    );
  }
  const chat = response.value;
  if (!chat) {
    return notFound();
  }

  return (
    <ChatInterface
      teamId={teamId}
      chatId={chatId}
      initialMessages={chat.messages.map((message) => ({
        id: message.id,
        parts: (message.parts.parts as Message["parts"]) ?? [],
        content: message.content,
        role: message.role,
        createdAt: new Date(message.createdAt),
        experimental_attachments: message.attachments,
      }))}
    />
  );
}
