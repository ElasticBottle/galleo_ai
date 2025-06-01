import { ok, safe } from "@rectangular-labs/result";
import { getMarkFileUrl } from "../../aws/s3";
import { getDb } from "../../hono";

export async function getChatAndMessageByTeamIdAndChatId(
  teamId: number,
  chatId: string,
) {
  const db = getDb();
  const result = await safe(() =>
    db.query.chatTable.findFirst({
      where: (table, { eq, and, isNull }) =>
        and(
          eq(table.id, chatId),
          eq(table.teamId, teamId),
          isNull(table.deletedAt),
        ),
      with: {
        messages: {
          where: (table, { isNull }) => isNull(table.deletedAt),
          orderBy: (table, { asc }) => [asc(table.createdAt)],
        },
      },
    }),
  );

  if (!result.ok) {
    console.error(
      `Failed to get chat and messages for id ${chatId}:`,
      result.error,
    );
    return result;
  }

  const chatWithMessages = result.value;
  if (!chatWithMessages) {
    return ok(null);
  }

  const updatedMessages = await Promise.all(
    chatWithMessages.messages.map(async (message) => {
      return {
        ...message,
        parts: message.parts.parts,
        attachments: await Promise.all(
          message.attachments.map(async (attachment) => {
            return {
              ...attachment,
              url: await getMarkFileUrl({ teamId, fileName: attachment.url }),
            };
          }),
        ),
        content:
          message.parts.parts
            ?.filter((part) => part.type === "text")
            .map((part) => part.text)
            .join("") ?? "",
      };
    }),
  );

  const chat = {
    ...chatWithMessages,
    messages: updatedMessages,
  };

  return ok(chat);
}
