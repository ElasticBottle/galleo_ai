import { InsertFeeQuoteItemSchema } from "@galleo/db/schema/fee-quote-item";
import { arktypeValidator } from "@hono/arktype-validator";
import { type } from "arktype";
import { Hono } from "hono";
import {
  authMiddleware,
  teamAuthMiddleware,
} from "../../../lib/auth/middleware";
import {
  deleteFeeQuoteItem,
  listFeeQuoteItems,
  upsertFeeQuoteItems,
} from "../../../lib/fee-quote/db";
import type { HonoEnv } from "../../../lib/hono";

export const feeQuoteRouter = new Hono<HonoEnv>()
  .basePath("/api/fee-quote")
  .get(
    "/:teamId",
    authMiddleware,
    teamAuthMiddleware,
    arktypeValidator(
      "param",
      type({
        teamId: "string.integer.parse",
      }),
    ),
    async (c) => {
      const { teamId } = c.req.valid("param");

      const items = await listFeeQuoteItems(teamId);
      if (!items.ok) {
        console.error("Failed to retrieve fee structure:", items.error);
        return c.json({ error: "Failed to retrieve fee structure" }, 500);
      }
      return c.json({ feeQuoteItems: items.value });
    },
  )
  .put(
    "/:teamId",
    authMiddleware,
    teamAuthMiddleware,
    arktypeValidator(
      "json",
      type({
        items: [InsertFeeQuoteItemSchema, "[]"],
      }),
    ),
    arktypeValidator(
      "param",
      type({
        teamId: "string.integer.parse",
      }),
    ),
    async (c) => {
      const { items } = c.req.valid("json");
      const { teamId } = c.req.valid("param");

      if (c.get("session").teamRoles.every((role) => role.teamId !== teamId)) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const result = await upsertFeeQuoteItems(
        items.map((item) => ({
          ...item,
          teamId,
        })),
        teamId,
      );

      if (!result.ok) {
        console.error("Failed to upsert fee quote items:", result.error);
        return c.json("Error updating fee quote items", 500);
      }

      return c.json({ feeQuoteItems: result.value });
    },
  )
  .delete(
    "/:teamId/:id",
    authMiddleware,
    teamAuthMiddleware,
    arktypeValidator(
      "param",
      type({
        id: "string.integer.parse",
        teamId: "string.integer.parse",
      }),
    ),
    async (c) => {
      const validatedParams = c.req.valid("param");

      const result = await deleteFeeQuoteItem(validatedParams.id);
      if (!result.ok) {
        console.error("Failed to delete fee quote item:", result.error);
        return c.json("Error deleting fee quote item", 500);
      }

      return c.json({ feeQuoteItems: result.value });
    },
  );
