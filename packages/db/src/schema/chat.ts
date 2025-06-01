import { relations } from "drizzle-orm";
import { integer, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./_helper";
import { pgAppTable } from "./_table";
import { messageTable } from "./message";
import { teamTable } from "./team";

export const chatTable = pgAppTable("chat", {
  id: varchar("chat_id", { length: 32 }).primaryKey(),
  teamId: integer("team_id")
    .references(() => teamTable.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  ...timestamps,
});

export const chatTableRelations = relations(chatTable, ({ one, many }) => ({
  team: one(teamTable, {
    fields: [chatTable.teamId],
    references: [teamTable.id],
  }),
  messages: many(messageTable),
}));

export type SelectChat = typeof chatTable.$inferSelect;
export type InsertChat = typeof chatTable.$inferInsert;
