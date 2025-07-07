export const ROUTE_HOME = "/";
export const ROUTE_CONTACT_US = "https://cal.com/ink-and-scribe/15min";

export const ROUTE_DASHBOARD_TEAM = (teamId: number) => `/dashboard/${teamId}`;
export const ROUTE_DASHBOARD = "/dashboard";

export const ROUTE_FEE_QUOTE = (teamId: number) =>
  `/dashboard/${teamId}/fee-quote`;

export const ROUTE_TRADEMARK_ASSISTANT = (teamId: number) =>
  `/dashboard/${teamId}/trademark-assistant`;
export const ROUTE_TRADEMARK_ASSISTANT_CHAT = ({
  teamId,
  chatId,
}: { teamId: number; chatId: string }) =>
  `/dashboard/${teamId}/trademark-assistant/${chatId}`;
export const ROUTE_CHAT_BACKEND_API = (teamId: string, chatId: string) =>
  `/api/${teamId}/chat/${chatId}`;
