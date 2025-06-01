import { type InsertChat, chatTable } from "@galleo/db/schema/chat";
import { err, ok, safe } from "@rectangular-labs/result";
import { createIdGenerator } from "ai";
import { getDb } from "../../hono";

export async function insertChat(chatDetails: Omit<InsertChat, "id">) {
  const db = getDb();
  const id = createIdGenerator({
    size: 24,
    prefix: "chat",
  })();
  const result = await safe(() =>
    db
      .insert(chatTable)
      .values({ ...chatDetails, id })
      .returning(),
  );

  if (!result.ok) {
    console.error("Failed to insert chat:", result.error);
    return result;
  }

  const chat = result.value?.[0];
  if (!chat) {
    return err(new Error("Insert chat returned no result"));
  }

  return ok(chat);
}
