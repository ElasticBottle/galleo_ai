import { relations } from "drizzle-orm";
import { index, serial, text, uniqueIndex } from "drizzle-orm/pg-core";
import { timestamps } from "./_helper";
import { pgAppTable } from "./_table";
import { teamRoleTable } from "./team-role";

export const userTable = pgAppTable(
  "user",
  {
    id: serial("user_id").primaryKey(),
    providerId: text("provider_id").notNull().unique(),
    username: text(),
    email: text(),
    imageUrl: text(),
    ...timestamps,
  },
  (table) => {
    return [
      index("user_username_unique_idx").on(table.username),
      index("user_email_unique_idx").on(table.email),
      uniqueIndex("user_provider_id_unique_idx").on(table.providerId),
    ];
  },
);
export type SelectUser = typeof userTable.$inferSelect;
export type InsertUser = typeof userTable.$inferInsert;

export const userRelations = relations(userTable, ({ many }) => {
  return {
    teamRoles: many(teamRoleTable),
  };
});
