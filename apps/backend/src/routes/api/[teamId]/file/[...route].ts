import { arktypeValidator } from "@hono/arktype-validator";
import { type } from "arktype";
import { Hono } from "hono";
import { stream } from "hono/streaming";
import {
  authMiddleware,
  teamAuthMiddleware,
} from "../../../../lib/auth/middleware";
import { getMarkFile } from "../../../../lib/aws/s3";
export const fileRouter = new Hono()
  .basePath("/api/:teamId/file")
  .get(
    "/:fileName",
    arktypeValidator(
      "param",
      type({ teamId: "string.integer.parse", fileName: "string" }),
    ),
    authMiddleware,
    teamAuthMiddleware,
    async (c) => {
      const { teamId, fileName } = c.req.valid("param");

      const file = await getMarkFile({
        fileName,
        teamId,
      });
      if (!file.ok) {
        console.error("Error getting mark file", file.error);
        return c.json({ error: "File not found" }, 404);
      }
      const data = file.value.data;
      if (!data) {
        return c.json({ error: "File not found" }, 404);
      }
      c.header(
        "Content-Type",
        file.value.contentType ?? "application/octet-stream",
      );
      return stream(c, async (stream) => {
        stream.onAbort(() => {
          console.log("Aborted!");
        });
        await stream.write(data);
      });
    },
  );
