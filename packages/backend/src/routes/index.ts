import { chatRouter } from "./api/[teamId]/chat/[chatId]/route";
import { chatsRouter } from "./api/[teamId]/chat/route";
import { auth } from "./api/auth/[...route]";
import { feeQuoteRouter } from "./api/fee-quote/route";

export const app = {
  auth,
  chat: {
    ...chatsRouter,
    ...chatRouter,
  },
  feeQuote: feeQuoteRouter,
};
export type AppType = typeof app;
