import { AsyncLocalStorage } from "node:async_hooks";
import { type DB, createDb } from "@galleo/db";
import type { SelectTeam } from "@galleo/db/schema/team";
import type { SelectTeamRole } from "@galleo/db/schema/team-role";
import type { ServerEnv } from "@galleo/env";
import { os, type Context, ORPCError } from "@orpc/server";
import type { ResponseHeadersPluginContext } from "@orpc/server/plugins";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { verifySafe } from "../auth/client";
import { getUserAndTeams } from "../auth/db/get-user-and-default-team";

/**
 * Context that is shared across the request.
 */
const asyncLocalStorage = new AsyncLocalStorage<Context>();

const getContext = (): Parameters<
  Parameters<typeof baseRouter.use>["0"]
>[0]["context"] => {
  const store = asyncLocalStorage.getStore();
  if (!store) {
    throw new Error("Outside of a request context.");
  }
  return store;
};

export const getCookies = (): ReadonlyRequestCookies => {
  const context = getContext();
  return context.cookies;
};
export const getEnv = (): ServerEnv => {
  const context = getContext();
  return context.env;
};
export const getDb = (): DB => {
  const context = getContext();
  return createDb(context.env.DATABASE_URL);
};

export interface InitialRouterContext {
  env: ServerEnv;
  cookies: ReadonlyRequestCookies;
}

/**
 * Base router that is used to create all other routers.
 */
export const baseRouter = os
  .$context<ResponseHeadersPluginContext & InitialRouterContext>()
  .errors({
    UNAUTHORIZED: {},
    INTERNAL_SERVER_ERROR: {},
    BAD_REQUEST: {},
    NOT_FOUND: {},
  })
  .use(async ({ next, context }) => {
    return await asyncLocalStorage.run(context, async () => {
      return await next();
    });
  });

/**
 * Authentication router that is used to authenticate the user.
 */
export const authRouter = baseRouter.use(async ({ context, next, errors }) => {
  const access = context.cookies.get("access_token")?.value;
  const refresh = context.cookies.get("refresh_token")?.value;
  if (!access || !refresh) {
    throw new ORPCError("UNAUTHORIZED");
  }
  const verified = await verifySafe({ access, refresh });
  if (verified.err) {
    throw errors.UNAUTHORIZED();
  }

  const userAndTeam = await getUserAndTeams(verified.value.properties);
  if (!userAndTeam.ok) {
    console.error(
      "[Auth middleware]: Error getting user and default team",
      userAndTeam.error,
    );
    throw errors.INTERNAL_SERVER_ERROR();
  }
  return await next({
    context: {
      userSubject: verified.value.properties,
      session: userAndTeam.value,
    },
  });
});

export const teamIdMiddleware = os
  .$context<{
    session: {
      teamRoles: (SelectTeamRole & { team: SelectTeam })[];
    };
  }>()
  .middleware(async ({ context, next }, teamId: number) => {
    const { session } = context;
    if (!session.teamRoles.some((role) => role.teamId === teamId)) {
      throw new ORPCError("UNAUTHORIZED");
    }
    return await next();
  });
