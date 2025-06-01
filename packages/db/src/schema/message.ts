import type { Message } from "@ai-sdk/react";
import { relations } from "drizzle-orm";
import { integer, jsonb, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./_helper";
import { pgAppTable } from "./_table";
import { chatTable } from "./chat";
import { userTable } from "./user";

export type MessageAttachment = {
  url: string;
  name: string;
  contentType: string;
};

export const messageTable = pgAppTable("message", {
  id: varchar("message_id", { length: 32 }).primaryKey(),
  chatId: varchar("chat_id", { length: 32 })
    .references(() => chatTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  userId: integer("user_id")
    .references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  parts: jsonb("parts").$type<Pick<Message, "parts">>().notNull(),
  attachments: jsonb("attachments")
    .$type<MessageAttachment[]>()
    .notNull()
    .default([]),
  role: varchar("role", {
    length: 255,
    enum: ["user", "assistant", "system"],
  }).notNull(),
  ...timestamps,
});
export const messageTableRelations = relations(messageTable, ({ one }) => ({
  chat: one(chatTable, {
    fields: [messageTable.chatId],
    references: [chatTable.id],
  }),
  user: one(userTable, {
    fields: [messageTable.userId],
    references: [userTable.id],
  }),
}));

export type SelectMessage = typeof messageTable.$inferSelect;
export type InsertMessage = typeof messageTable.$inferInsert;
