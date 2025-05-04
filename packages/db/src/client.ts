import { drizzle } from "drizzle-orm/node-postgres";
import { schema } from "./schema";

export const createDb = (connectionString: string) => {
  return drizzle(connectionString, { schema, casing: "snake_case" });
};

export type DB = ReturnType<typeof createDb>;
