import * as chat from "./api/[teamId]/chat/[chatId]/route";
import * as chats from "./api/[teamId]/chat/route";
import * as auth from "./api/auth/[...route]";
import * as feeQuote from "./api/fee-quote/route";

export const app = {
  auth,
  chat: {
    ...chat,
    ...chats,
  },
  feeQuote,
};

export type AppType = typeof app;
