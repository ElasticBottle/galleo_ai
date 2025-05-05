import { createInsertSchema } from "drizzle-arktype";
import { index, integer, serial, text } from "drizzle-orm/pg-core";
import { timestamps } from "./_helper";
import { pgAppTable } from "./_table";
import { teamTable } from "./team";

export const feeQuoteItemsTable = pgAppTable(
  "fee_quote_item",
  {
    id: serial("id").primaryKey(),
    teamId: integer("team_id")
      .notNull()
      .references(() => teamTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    description: text().notNull(),
    basePriceUnit: integer("base_price_unit").notNull().default(0),
    basePriceDecimal: integer("base_price_decimal").notNull().default(2),
    basePriceCurrency: text("base_price_currency", { enum: ["SGD"] })
      .notNull()
      .default("SGD"),
    professionalPriceUnit: integer("professional_price_unit")
      .notNull()
      .default(0),
    professionalPriceDecimal: integer("professional_price_decimal")
      .notNull()
      .default(2),
    professionalPriceCurrency: text("professional_price_currency", {
      enum: ["SGD"],
    })
      .notNull()
      .default("SGD"),
    ...timestamps,
  },
  (table) => [index("fee_quote_item_team_id_idx").on(table.teamId)],
);

export type SelectFeeQuoteItem = typeof feeQuoteItemsTable.$inferSelect;
export type InsertFeeQuoteItem = typeof feeQuoteItemsTable.$inferInsert;

export const InsertFeeQuoteItemSchema = createInsertSchema(
  feeQuoteItemsTable,
).omit("createdAt", "updatedAt", "deletedAt", "teamId");
