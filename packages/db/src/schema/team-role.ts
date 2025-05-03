import { relations } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./_helper";
import { pgAppTable } from "./_table";
import { teamTable } from "./team";
import { userTable } from "./user";

export const teamRoleTable = pgAppTable(
  "team_role",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    teamId: integer("team_id")
      .notNull()
      .references(() => teamTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    role: varchar("role", {
      enum: ["admin", "member"],
      length: 128,
    })
      .notNull()
      .default("member"),
    ...timestamps,
  },
  (table) => {
    return [primaryKey({ columns: [table.userId, table.teamId] })];
  },
);

export type SelectTeamRole = typeof teamRoleTable.$inferSelect;
export type InsertTeamRole = typeof teamRoleTable.$inferInsert;

export const teamRoleRelations = relations(teamRoleTable, ({ one }) => ({
  user: one(userTable, {
    fields: [teamRoleTable.userId],
    references: [userTable.id],
  }),
  team: one(teamTable, {
    fields: [teamRoleTable.teamId],
    references: [teamTable.id],
  }),
}));
