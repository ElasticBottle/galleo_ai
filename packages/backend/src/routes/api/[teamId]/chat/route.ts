import { type } from "arktype";
import { createChat } from "../../../../lib/chat/create-chat";
import { getAllChatOverviewByTeamId } from "../../../../lib/chat/db/get-all-chat-overview-by-team-id";
import { authRouter, teamIdMiddleware } from "../../../../lib/orpc/routers";

const newChat = authRouter
  .input(
    type({
      teamId: "string.integer.parse",
      messages: type({
        content: "string",
        attachments: type({
          name: "string",
          url: "string",
          contentType: "string",
        }).array(),
      }).array(),
    }),
  )
  .use(teamIdMiddleware, (input) => input.teamId)
  .output(
    type({
      chatId: "string",
    }),
  )
  .handler(async ({ input, errors, context }) => {
    const { teamId, messages } = input;
    const message = messages[0];
    if (!message) {
      throw errors.BAD_REQUEST({
        message: "No message provided",
      });
    }

    const { session } = context;

    const createChatResult = await createChat({
      teamId,
      userId: session.user.id,
      initialMessageContent: message.content,
      attachments: message.attachments,
    });

    if (!createChatResult.ok) {
      console.error("Failed to create chat:", createChatResult.error);
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Failed to create chat",
      });
    }
    return { chatId: createChatResult.value.chat.id };
  });
const getChats = authRouter
  .input(
    type({
      teamId: "string.integer.parse",
    }),
  )
  .use(teamIdMiddleware, (input) => input.teamId)
  .output(
    type({
      chats: type({
        id: "string",
        title: "string",
        teamId: "number",
        updatedAt: "Date",
        createdAt: "Date",
        deletedAt: "Date|null",
      }).array(),
    }),
  )
  .handler(async ({ input, errors }) => {
    const { teamId } = input;
    const chats = await getAllChatOverviewByTeamId(teamId);
    if (!chats.ok) {
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Failed to get chats",
      });
    }
    return { chats: chats.value };
  });
export { getChats, newChat };
