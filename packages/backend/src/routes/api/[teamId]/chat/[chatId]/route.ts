import { os } from "@orpc/server";
import { type Message, appendResponseMessages, streamText } from "ai";
import { type } from "arktype";
import { backgroundResearch } from "../../../../../lib/ai/business-research";
import { markFilingRecommendation } from "../../../../../lib/ai/mark-filing-recommendation";
import { mainAgentModel } from "../../../../../lib/ai/models";
import { niceClassification } from "../../../../../lib/ai/nice-classification";
import { relevantGoodsServices } from "../../../../../lib/ai/relevant-goods-services";
import { getChatAndMessageByTeamIdAndChatId } from "../../../../../lib/chat/db/get-chat-and-message-by-id";
import { upsertMessage } from "../../../../../lib/chat/db/upsert-message";
import { uploadAttachments } from "../../../../../lib/chat/upload-attachments";
import {
  type InitialRouterContext,
  authRouter,
  teamIdMiddleware,
} from "../../../../../lib/orpc/routers";

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

const messageLawyer = authRouter
  .route({
    method: "POST",
    path: "/",
  })
  .input(
    type({
      teamId: "string.integer.parse",
      chatId: "string",
      messages: "unknown",
    }),
  )
  .use(teamIdMiddleware, (input) => input.teamId)
  .handler(async ({ input, errors, context }) => {
    const { teamId, chatId, messages: messagesInput } = input;
    const messages = messagesInput as Message[];
    const { session } = context;
    // Define and import actual tools
    const tools = {
      backgroundResearch: backgroundResearch,
      niceClassification: niceClassification,
      relevantGoodsServices: relevantGoodsServices,
      markFilingRecommendation: markFilingRecommendation,
    };
    // save user message
    const latestMessage = messages.at(-1);
    if (!latestMessage) {
      throw errors.BAD_REQUEST({
        message: "No message provided",
      });
    }
    if (messages.length > 1) {
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
        throw errors.INTERNAL_SERVER_ERROR({
          message: "Failed to upload attachments",
        });
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
        messages,
        tools: tools,
        maxSteps: 12,
        onFinish: async ({ response }) => {
          // save assistant message
          const newMessage = appendResponseMessages({
            messages,
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
      return dataStream;
    } catch (error) {
      console.error("Error calling streamText:", error);
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Failed to process chat request",
      });
    }
  });
const getChat = authRouter
  .route({
    method: "GET",
    path: "/{chatId}",
  })
  .input(
    type({
      teamId: "string.integer.parse",
      chatId: "string",
    }),
  )
  .use(teamIdMiddleware, (input) => input.teamId)
  .handler(async ({ input, errors }) => {
    const { teamId, chatId } = input;
    const chat = await getChatAndMessageByTeamIdAndChatId(teamId, chatId);
    if (!chat.ok) {
      throw errors.NOT_FOUND({
        message: "Chat not found",
      });
    }
    return chat.value;
  });

export const chatRouter = os
  .$context<InitialRouterContext>()
  .prefix("/{teamId}/chat/{chatId}")
  .router({
    messageLawyer,
    getChat,
  });
