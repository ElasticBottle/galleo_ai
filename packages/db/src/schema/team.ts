import { relations } from "drizzle-orm";
import { index, serial, text } from "drizzle-orm/pg-core";
import { timestamps } from "./_helper";
import { pgAppTable } from "./_table";
import { teamRoleTable } from "./team-role";

export const teamTable = pgAppTable(
  "team",
  {
    id: serial("team_id").primaryKey(),
    name: text("name").notNull(),
    ...timestamps,
  },
  (table) => {
    return [index("team_name_unique_idx").on(table.name)];
  },
);
export type SelectTeam = typeof teamTable.$inferSelect;
export type InsertTeam = typeof teamTable.$inferInsert;

export const teamRelations = relations(teamTable, ({ many }) => {
  return {
    teamRoles: many(teamRoleTable),
  };
});
