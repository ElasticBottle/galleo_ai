import type { ServerEnv } from "@galleo/env";
import { os } from "@orpc/server";
import { safe, safeFetch } from "@rectangular-labs/result";
import { type } from "arktype";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { redirect } from "next/navigation";
import { authClient, verifySafe } from "../../../lib/auth/client";
import { getUserAndTeams } from "../../../lib/auth/db/get-user-and-default-team";
import { deleteSession, setSession } from "../../../lib/auth/session";
import { arrayBufferToBase64 } from "../../../lib/auth/util";
import { authRouter, baseRouter, getEnv } from "../../../lib/orpc/routers";

const getSession = authRouter.input(type({})).handler(({ context }) => {
  const { session, userSubject } = context;
  return { session, userSubject };
});
const logout = authRouter.handler(() => {
  const deleted = deleteSession();
  return { message: deleted ? "OK" : "No Session" };
});

const authorize = baseRouter
  .route({
    method: "GET",
    path: "/authorize",
  })
  .handler(async () => {
    const env = getEnv();
    const callbackUrl = `${env.NEXT_PUBLIC_BACKEND_URL}/api/auth/callback`;
    const { url: redirectUrl } = await authClient().authorize(
      callbackUrl,
      "code",
    );
    return { redirectUrl };
  });

const callback = baseRouter
  .route({
    method: "GET",
    path: "/callback",
  })
  .input(
    type({
      code: "string",
    }),
  )
  .handler(async ({ input, errors }) => {
    const env = getEnv();
    const { code } = input;
    const exchanged = await authClient().exchange(
      code,
      `${env.NEXT_PUBLIC_BACKEND_URL}/api/auth/callback`,
    );
    if (exchanged.err) {
      throw errors.BAD_REQUEST({
        message: exchanged.err.toString(),
      });
    }
    setSession(exchanged.tokens.access, exchanged.tokens.refresh);

    const verified = await verifySafe({
      access: exchanged.tokens.access,
      refresh: exchanged.tokens.refresh,
    });
    if (verified.err) {
      throw errors.UNAUTHORIZED({});
    }

    const userProperties = verified.value.properties;
    if (userProperties?.id?.startsWith("microsoft_")) {
      const [url, accessToken] = userProperties.image?.split("#") ?? [];
      if (!url || !accessToken) {
        throw errors.UNAUTHORIZED({});
      }
      const photoResponseResult = await safeFetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (photoResponseResult.ok) {
        const photoResponse = photoResponseResult.value;
        const contentType = photoResponse.headers.get("Content-Type");
        const imageBufferResult = await safe(() => photoResponse.arrayBuffer());
        if (imageBufferResult.ok && contentType) {
          const base64Image = arrayBufferToBase64(imageBufferResult.value);
          userProperties.image = `data:${contentType};base64,${base64Image}`;
        }
      }
    }

    const userAndTeam = await getUserAndTeams(userProperties);
    if (!userAndTeam.ok) {
      throw errors.UNAUTHORIZED({});
    }

    const teamId = userAndTeam.value.teamRoles[0]?.team.id;
    if (!teamId) {
      throw errors.UNAUTHORIZED({});
    }

    return redirect(`${env.NEXT_PUBLIC_APP_URL}/dashboard/${teamId}`);
  });

export const auth = os
  .$context<{
    env: ServerEnv;
    cookies: ReadonlyRequestCookies;
  }>()
  .prefix("/api/auth")
  .router({
    getSession,
    authorize,
    callback,
    logout,
  });
