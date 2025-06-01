import type { Message } from "@ai-sdk/react";
import { jsonb, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./_helper";
import { pgAppTable } from "./_table";
import { teamTable } from "./team";
import { userTable } from "./user";

export const chatTable = pgAppTable("chat", {
  id: varchar("chat_id", { length: 32 }).primaryKey(),
  teamId: varchar("team_id") // Adjusted length to be compatible with serial
    .references(() => teamTable.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  ...timestamps,
});

export const messageTable = pgAppTable("message", {
  id: varchar("message_id", { length: 32 }).primaryKey(),
  chatId: varchar("chat_id", { length: 32 })
    .references(() => chatTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  userId: varchar("user_id")
    .references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  parts: jsonb("parts").$type<Pick<Message, "parts">>().notNull(),
  role: varchar("role", {
    length: 255,
    enum: ["user", "assistant", "system"],
  }).notNull(),
  ...timestamps,
});
