import { google } from "@ai-sdk/google"; // Import google instead of openai
import type { MessageAttachment } from "@galleo/db/schema/message";
import { ok } from "@rectangular-labs/result";
import { generateText } from "ai";
import { insertChat } from "./db/insert-chat";
import { upsertMessage } from "./db/upsert-message";
import { uploadAttachments } from "./upload-attachments";

export async function createChat({
  teamId,
  userId,
  initialMessageContent,
  attachments,
}: {
  teamId: number;
  userId: number;
  initialMessageContent: string;
  attachments: MessageAttachment[];
}) {
  const { text: chatTitle } = await generateText({
    model: google("gemini-2.0-flash-lite-preview-02-05"),
    prompt: `Generate a concise and relevant title for a new chat about trademarking based on the following initial message. The title should be no more than 5 words about the initial message. 

Do not include any other text in the title.
Do not use any formatting in the title.
Situate the title in the context of trademarking.
    
Initial message: "${initialMessageContent}"`,
  });

  const uploadedAttachmentsResult = await uploadAttachments({
    attachments,
    teamId,
  });
  if (!uploadedAttachmentsResult.ok) {
    console.error(
      "Failed to upload attachments:",
      uploadedAttachmentsResult.error,
    );
    return uploadedAttachmentsResult;
  }
  const uploadedAttachments = uploadedAttachmentsResult.value;

  const insertResult = await insertChat({
    teamId: teamId,
    title: chatTitle || "New Chat",
  });

  if (!insertResult.ok) {
    console.error("Failed to create chat:", insertResult.error);
    return insertResult;
  }

  const upsertResult = await upsertMessage({
    chatId: insertResult.value.id,
    parts: {
      parts: [
        {
          type: "text",
          text: initialMessageContent,
        },
      ],
    },
    attachments: uploadedAttachments,
    role: "user",
    userId,
  });
  if (!upsertResult.ok) {
    console.error("Failed to create message:", upsertResult.error);
    return upsertResult;
  }

  return ok({
    chat: insertResult.value,
    message: upsertResult.value,
  });
}
