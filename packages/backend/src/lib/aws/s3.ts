import type { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ok, safe } from "@rectangular-labs/result";
import mime from "mime-types";
import { Resource } from "sst/resource";

const s3Client = new S3Client();
console.log("Resource", Resource);
const ipMarksMediaBucket = () => Resource.IpMarksMedia.name;

export async function getMarkFileUrl({
  teamId,
  fileName,
}: { teamId: number; fileName: string }) {
  const contentType = mime.contentType(fileName);
  const getCommand = new GetObjectCommand({
    Bucket: ipMarksMediaBucket(),
    Key: `team-${teamId}/file/${fileName}`,
    ResponseContentType: contentType || undefined,
  });
  const url = await getSignedUrl(s3Client, getCommand);
  return url;
}

export async function getMarkFile({
  teamId,
  fileName,
}: { teamId: number; fileName: string }) {
  const contentType = mime.contentType(fileName);

  const getCommand = new GetObjectCommand({
    Bucket: ipMarksMediaBucket(),
    Key: `team-${teamId}/file/${fileName}`,
    ResponseContentType: contentType || undefined,
  });
  const response = await safe(() => s3Client.send(getCommand));
  if (!response.ok) {
    console.error("Error getting mark file", response.error);
    return response;
  }
  const data = await response.value.Body?.transformToByteArray();
  return ok({
    data,
    contentType: response.value.ContentType,
  });
}

export async function putMarkFile({
  teamId,
  file,
  extension,
}: { teamId: string; file: Buffer; extension: string | false }) {
  const fileId = randomUUID();
  const fileName = `${fileId}${extension ? `.${extension}` : ""}`;
  const putCommand = new PutObjectCommand({
    Bucket: ipMarksMediaBucket(),
    Key: `team-${teamId}/file/${fileName}`,
    Body: file,
  });
  const result = await safe(() => s3Client.send(putCommand));
  if (!result.ok) {
    console.error("Error putting mark file", result.error);
    return result;
  }
  return ok({ fileId, fileName });
}
