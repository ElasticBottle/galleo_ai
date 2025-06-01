import { Buffer } from "node:buffer";
import type { MessageAttachment } from "@galleo/db/schema/message";
import { ok } from "@rectangular-labs/result";
import mime from "mime-types";
import { putMarkFile } from "../aws/s3";

export async function uploadAttachments({
  attachments,
  teamId,
}: { attachments: MessageAttachment[]; teamId: number }) {
  const uploadedAttachmentsResult = await Promise.all(
    attachments.map(async (attachment) => {
      const data = attachment.url.split(",")[1];
      if (!data) {
        return;
      }
      const buffer = Buffer.from(data, "base64");
      const result = await putMarkFile({
        teamId: teamId.toString(),
        file: buffer,
        extension: mime.extension(attachment.contentType),
      });
      if (!result.ok) {
        console.error("Error uploading attachment", result.error);
        return result;
      }
      const { fileName } = result.value;
      return ok({
        ...attachment,
        url: fileName,
      });
    }),
  );
  const uploadedAttachments = uploadedAttachmentsResult
    .filter((attachment) => !!attachment?.ok)
    .map((attachment) => attachment.value);

  return ok(uploadedAttachments);
}
