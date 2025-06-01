import { Buffer } from "node:buffer";
import { google } from "@ai-sdk/google"; // Import google instead of openai
import type { MessageAttachment } from "@galleo/db/schema/message";
import { ok } from "@rectangular-labs/result";
import { generateText } from "ai";
import mime from "mime-types";
import { putMarkFile } from "../aws/s3";
import { insertChat } from "./db/insert-chat";
import { upsertMessage } from "./db/upsert-message";
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
    prompt: `Generate a concise and relevant title for a new chat based on the following initial message. The title should be no more than 5 words. Initial message: "${initialMessageContent}"`,
  });

  const uploadedAttachmentsResult = await Promise.all(
    attachments.map(async (attachment) => {
      const data = attachment.url.split(",")[1];
      if (!data) {
        return;
      }
      const buffer = Buffer.from(data, "base64");
      const { fileName } = await putMarkFile({
        teamId: teamId.toString(),
        file: buffer,
        extension: mime.extension(attachment.contentType),
      });
      return {
        ...attachment,
        url: fileName,
      };
    }),
  );
  const uploadedAttachments = uploadedAttachmentsResult.filter(
    (attachment) => attachment !== undefined,
  );

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
