import { type InsertMessage, messageTable } from "@galleo/db/schema/message";
import { type Result, err, ok, safe } from "@rectangular-labs/result";
import { createIdGenerator } from "ai";
import { getDb } from "../../orpc/routers";

export async function upsertMessage(
  messageDetails: Omit<InsertMessage, "id">,
): Promise<Result<{ id: string }>> {
  const db = getDb();
  const messageId = createIdGenerator({
    size: 24,
    prefix: "msg",
  })();

  const result = await safe(() =>
    db
      .insert(messageTable)
      .values({
        ...messageDetails,
        id: messageId,
      })
      .onConflictDoUpdate({
        target: messageTable.id,
        set: {
          parts: messageDetails.parts,
          attachments: messageDetails.attachments,
          role: messageDetails.role,
        },
      })
      .returning({ id: messageTable.id }),
  );

  if (!result.ok) {
    console.error("Failed to upsert message:", result.error);
    return result;
  }

  const message = result.value?.[0];
  if (!message) {
    return err(new Error("Upsert message returned no result or ID"));
  }

  return ok(message);
}
