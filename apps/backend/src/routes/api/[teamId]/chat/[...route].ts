import { arktypeValidator } from "@hono/arktype-validator";
import { type Message, appendResponseMessages, streamText } from "ai";
import { type } from "arktype";
import { Hono } from "hono";
import { stream } from "hono/streaming";
import { backgroundResearch } from "../../../../lib/ai/business-research";
import { markFilingRecommendation } from "../../../../lib/ai/mark-filing-recommendation";
import { mainAgentModel } from "../../../../lib/ai/models";
import { niceClassification } from "../../../../lib/ai/nice-classification";
import { relevantGoodsServices } from "../../../../lib/ai/relevant-goods-services";
import {
  authMiddleware,
  teamAuthMiddleware,
} from "../../../../lib/auth/middleware";
import { createChat } from "../../../../lib/chat/create-chat";
import { getAllChatOverviewByTeamId } from "../../../../lib/chat/db/get-all-chat-overview-by-team-id";
import { getChatAndMessageByTeamIdAndChatId } from "../../../../lib/chat/db/get-chat-and-message-by-id";
import { upsertMessage } from "../../../../lib/chat/db/upsert-message";
import { uploadAttachments } from "../../../../lib/chat/upload-attachments";

// Define the system prompt
// Once you have sufficient information (including background context, NICE classification, and relevant goods/services), you can ask for the mark filling recommendation and give your final output.

// You final output MUST be a draft email addressed to the client.
// This email should:
// 1.  Acknowledge and clearly answer all aspects of the client's original query.
// 2.  Summarize the findings from your research (background, classification, goods/services).
// 3.  Provide preliminary recommendations based on the findings (e.g., potential classes to file under, type of mark considerations).
// 4.  Politely nudge the client towards engaging the firm for formal filing and consultation, highlighting the firm's expertise.
// 5.  Maintain a professional, helpful, and confident tone.
const systemPrompt = `You are an expert Singapore trademark law assistant working for a prestigious law firm.
Your primary goal is to understand the user's request regarding trademark registration, ask clarifying questions if necessary, and fulfills the user's request.

You can utilize the provided tools to below as needed to fulfill the user's request:
- Background research on the client's business using current information from the web.
- NICE classification lookup.
- Identification of pre-approved goods/services based on business descriptions.
- Mark filing recommendation based on background, NICE classification, and proposed mark.

Notes: 
- When ask to generate a report, you should generate a report in markdown format. The report should be in the following structure:
  - Title
  - Introduction
  - Body (note that this should be properly formatted in markdown and contain proper headings and subheadings)
  - Conclusion
- When ask to generate a draft email or create a pre-filling advice email, you should generate a draft email in the format of a markdown file. The email should be in the following format:
  - Acknowledge and clearly answer all aspects of the client's original query.
  - Summarize the findings from your research (background, classification, goods/services).
  - Provide preliminary recommendations based on the findings (e.g., potential classes to file under, type of mark considerations).
  - Politely nudge the client towards engaging the firm for formal filing and consultation, highlighting the firm's expertise.
  - Maintain a professional, helpful, and confident tone

Do not include backticks in the markdown.
Do not include any preamble or introduction.
Do not provide definitive legal advice, but rather informed recommendations based on the gathered data. Always qualify your recommendations appropriately (e.g., "Based on preliminary analysis...", "We would recommend further consultation to confirm...").
Do not add disclaimers or warnings.
Use markdown for formatting the email draft.
Always use the tools at your disposal before asking the lawyer for more information.`;

export const chatRouter = new Hono()
  .basePath("/api/:teamId/chat")
  .post(
    "/",
    arktypeValidator("param", type({ teamId: "string.integer.parse" })),
    arktypeValidator(
      "json",
      type({
        messages: type({
          content: "string",
          attachments: type({
            name: "string",
            url: "string",
            contentType: "string",
          }).array(),
        }).array(),
      }),
    ),
    authMiddleware,
    teamAuthMiddleware,
    async (c) => {
      const { teamId } = c.req.valid("param");
      const { messages } = c.req.valid("json");

      const message = messages[0];
      if (!message) {
        return c.json({ error: "No message provided" }, 400);
      }

      const session = c.get("session");

      const createChatResult = await createChat({
        teamId,
        userId: session.user.id,
        initialMessageContent: message.content,
        attachments: message.attachments,
      });

      if (!createChatResult.ok) {
        console.error("Failed to create chat:", createChatResult.error);
        return c.json({ error: "Failed to create chat" }, 500);
      }
      return c.json({ chatId: createChatResult.value.chat.id });
    },
  )
  .post(
    "/:chatId",
    arktypeValidator(
      "param",
      type({ teamId: "string.integer.parse", chatId: "string" }),
    ),
    authMiddleware,
    teamAuthMiddleware,
    async (c) => {
      const { teamId, chatId } = c.req.valid("param");
      const messages: { messages: Message[] } = await c.req.json();
      const session = c.get("session");

      // Define and import actual tools
      const tools = {
        backgroundResearch: backgroundResearch,
        niceClassification: niceClassification,
        relevantGoodsServices: relevantGoodsServices,
        markFilingRecommendation: markFilingRecommendation,
      };
      // save user message
      const latestMessage = messages.messages.at(-1);
      if (!latestMessage) {
        return c.json({ error: "No message provided" }, 400);
      }
      if (messages.messages.length > 1) {
        const uploadedAttachmentsResult = await uploadAttachments({
          attachments:
            latestMessage.experimental_attachments?.map((attachment) => ({
              url: attachment.url,
              name: attachment.name ?? "",
              contentType: attachment.contentType ?? "",
            })) ?? [],
          teamId,
        });
        if (!uploadedAttachmentsResult.ok) {
          console.error(
            "Failed to upload attachments:",
            uploadedAttachmentsResult.error,
          );
          return c.json({ error: "Failed to upload attachments" }, 500);
        }
        await upsertMessage({
          chatId: chatId,
          parts: latestMessage.parts ? { parts: latestMessage.parts } : {},
          role: latestMessage.role as "user" | "assistant" | "system",
          attachments: uploadedAttachmentsResult.value,
          userId: session.user.id,
        });
      }

      try {
        const result = streamText({
          model: mainAgentModel, // Use the main agent model
          system: systemPrompt,
          messages: messages.messages,
          tools: tools,
          maxSteps: 12,
          onFinish: async ({ response }) => {
            // save assistant message
            const newMessage = appendResponseMessages({
              messages: messages.messages,
              responseMessages: response.messages,
            }).at(-1);
            if (!newMessage) {
              return;
            }
            await upsertMessage({
              chatId: chatId,
              parts: newMessage.parts ? { parts: newMessage.parts } : {},
              role: newMessage.role as "user" | "assistant" | "system",
              userId: session.user.id,
            });
          },
          onError: (error) => {
            console.error("Error calling streamText:", error);
          },
          temperature: 0.2,
        });
        result.consumeStream();
        const dataStream = result.toDataStream({
          sendUsage: true,
          sendReasoning: true,
          sendSources: true,
        });
        c.header("Content-Type", "text/plain; charset=utf-8");
        return stream(c, async (stream) => {
          stream.onAbort(() => {
            console.log("Stream aborted!");
          });
          await stream.pipe(dataStream);
        });
      } catch (error) {
        console.error("Error calling streamText:", error);
        // Consider returning a more informative error response
        return c.json({ error: "Failed to process chat request" }, 500);
      }
    },
  )
  .get(
    "/",
    arktypeValidator("param", type({ teamId: "string.integer.parse" })),
    authMiddleware,
    teamAuthMiddleware,
    async (c) => {
      const { teamId } = c.req.valid("param");
      const chats = await getAllChatOverviewByTeamId(teamId);
      if (!chats.ok) {
        return c.json({ error: "Failed to get chats" }, 500);
      }
      return c.json(chats.value);
    },
  )
  .get(
    "/:chatId",
    arktypeValidator(
      "param",
      type({ teamId: "string.integer.parse", chatId: "string" }),
    ),
    authMiddleware,
    teamAuthMiddleware,
    async (c) => {
      const { teamId, chatId } = c.req.valid("param");
      const chat = await getChatAndMessageByTeamIdAndChatId(teamId, chatId);
      if (!chat.ok) {
        return c.json({ error: "Chat not found" }, 404);
      }
      console.log("chat", JSON.stringify(chat.value, null, 2));
      return c.json(chat.value);
    },
  );
