import { InsertFeeQuoteItemSchema } from "@galleo/db/schema/fee-quote-item";
import { type } from "arktype";

import {
  deleteFeeQuoteItem,
  listFeeQuoteItems,
  upsertFeeQuoteItems,
} from "../../../lib/fee-quote/db";
import { authRouter } from "../../../lib/orpc/routers";

const getItems = authRouter
  .input(
    type({
      teamId: "string.integer.parse",
    }),
  )
  .handler(async ({ input, errors }) => {
    const { teamId } = input;
    const items = await listFeeQuoteItems(teamId);
    if (!items.ok) {
      console.error("Failed to retrieve fee structure:", items.error);
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Failed to retrieve fee structure",
      });
    }
    return { feeQuoteItems: items.value };
  });
const upsertItem = authRouter
  .input(
    type({
      teamId: "string.integer.parse",
      items: [InsertFeeQuoteItemSchema, "[]"],
    }),
  )
  .handler(async ({ input, errors }) => {
    const { teamId, items } = input;
    const result = await upsertFeeQuoteItems(
      items.map((item) => ({
        ...item,
        teamId,
      })),
      teamId,
    );
    if (!result.ok) {
      console.error("Failed to upsert fee quote items:", result.error);
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Failed to upsert fee quote items",
      });
    }
    return { feeQuoteItems: result.value };
  });

const deleteItem = authRouter
  .input(
    type({
      teamId: "string.integer.parse",
    }),
  )
  .handler(async ({ input, errors }) => {
    const { teamId } = input;
    const result = await deleteFeeQuoteItem(teamId);
    if (!result.ok) {
      console.error("Failed to delete fee quote item:", result.error);
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Failed to delete fee quote item",
      });
    }
    return { feeQuoteItems: result.value };
  });

export { getItems, upsertItem, deleteItem };
