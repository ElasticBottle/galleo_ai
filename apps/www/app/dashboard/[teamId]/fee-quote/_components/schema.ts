import { InsertFeeQuoteItemSchema } from "@galleo/db/schema/fee-quote-item";
import { type } from "arktype";

export const feeQuoteFormSchema = type({
  items: [InsertFeeQuoteItemSchema, "[]"],
});
export type FeeQuoteFormValues = typeof feeQuoteFormSchema.infer;
