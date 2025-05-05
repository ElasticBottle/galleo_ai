// Type for the items expected by the upsert function

import { buildConflictUpdateColumns } from "@galleo/db";
import { eq } from "@galleo/db";
import type { InsertFeeQuoteItem } from "@galleo/db/schema/fee-quote-item";
import { schema } from "@galleo/db/schema/index";
import { safe } from "@rectangular-labs/result";
import { getDb } from "../hono";

export async function listFeeQuoteItems(teamId: number) {
  const db = getDb();
  return await safe(() =>
    db.query.feeQuoteItemsTable.findMany({
      where: (table, { eq, isNull, and }) =>
        and(eq(table.teamId, teamId), isNull(table.deletedAt)),
      orderBy: (table, { asc }) => [asc(table.createdAt)],
    }),
  );
}

export async function upsertFeeQuoteItems(
  items: InsertFeeQuoteItem[],
  teamId: number,
) {
  const db = getDb();

  return await safe(async () => {
    await db
      .delete(schema.feeQuoteItemsTable)
      .where(eq(schema.feeQuoteItemsTable.teamId, teamId));

    if (items.length === 0) {
      return [];
    }

    return await db
      .insert(schema.feeQuoteItemsTable)
      .values(items)
      .onConflictDoUpdate({
        target: schema.feeQuoteItemsTable.id,
        set: buildConflictUpdateColumns(schema.feeQuoteItemsTable, [
          "description",
          "basePriceUnit",
          "basePriceDecimal",
          "basePriceCurrency",
          "professionalPriceUnit",
          "professionalPriceDecimal",
          "professionalPriceCurrency",
        ]),
      })
      .returning();
  });
}

export async function deleteFeeQuoteItem(id: number) {
  const db = getDb();
  return await safe(() =>
    db
      .update(schema.feeQuoteItemsTable)
      .set({ deletedAt: new Date() })
      .where(eq(schema.feeQuoteItemsTable.id, id))
      .returning({ id: schema.feeQuoteItemsTable.id }),
  );
}
