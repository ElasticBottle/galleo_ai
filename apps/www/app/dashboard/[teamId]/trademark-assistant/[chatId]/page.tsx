import { notFound } from "next/navigation";
import { backend } from "~/lib/server/backend";
import { ChatInterface } from "./_components/chat";

export default async function ChatInstancePage({
  params,
}: {
  params: Promise<{ teamId: string; chatId: string }>;
}) {
  const { teamId, chatId } = await params;

  const response = await (await backend()).api[":teamId"].chat[":chatId"].$get({
    param: {
      teamId,
      chatId,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("Something went wrong fetching chat", error);
    return (
      <div>Something went wrong fetching chat. Please try again later.</div>
    );
  }
  const chat = await response.json();
  if (!chat) {
    return notFound();
  }
  console.log("chat", JSON.stringify(chat, null, 2));

  return (
    <ChatInterface
      teamId={teamId}
      chatId={chatId}
      initialMessages={chat.messages.map((message) => ({
        id: message.id,
        content: message.content,
        role: message.role,
        createdAt: new Date(message.createdAt),
        experimental_attachments: message.attachments,
      }))}
    />
  );
}
