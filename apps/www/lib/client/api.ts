import type { app } from "@galleo/backend";
import contract from "@galleo/backend/openapi";
import { createORPCClient } from "@orpc/client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { env } from "../env";

const link = new OpenAPILink(contract, {
  url: `${env.NEXT_PUBLIC_APP_URL}/api`,
});
export const api: RouterClient<typeof app> = createORPCClient(link);
export const apiOptions = createTanstackQueryUtils(api);
