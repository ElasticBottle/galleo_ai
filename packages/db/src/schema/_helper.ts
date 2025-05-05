import { type SQL, getTableColumns, sql } from "drizzle-orm";
import { type PgTable, timestamp } from "drizzle-orm/pg-core";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";

export const timestamps = {
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .default(sql`now()`)
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp({ mode: "date", withTimezone: true }),
};

export const buildConflictUpdateColumns = <
  T extends PgTable | SQLiteTable,
  Q extends keyof T["_"]["columns"],
>(
  table: T,
  columns: Q[],
) => {
  const cls = getTableColumns(table);

  return columns.reduce(
    (acc, column) => {
      const colName = cls[column]?.name;
      if (!colName) {
        throw new Error(
          `Column ${String(column)} not found in table columns: ${cls}`,
        );
      }
      acc[column] = sql.raw(`excluded.${colName}`);

      return acc;
    },
    {} as Record<Q, SQL>,
  );
};
