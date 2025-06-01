import * as chat from "./chat";
import * as feeQuoteItem from "./fee-quote-item";
import * as message from "./message";
import * as team from "./team";
import * as teamRole from "./team-role";
import * as user from "./user";

export const schema = {
  ...user,
  ...team,
  ...teamRole,
  ...feeQuoteItem,
  ...chat,
  ...message,
};
