import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";
import { authClient, verifySafe } from "../../../lib/auth/client";
import { getUserAndDefaultTeam } from "../../../lib/auth/db/get-user-and-default-team";
import { authMiddleware } from "../../../lib/auth/middleware";
import { setSession } from "../../../lib/auth/session";
import { env } from "../../../lib/env";
import type { HonoEnv } from "../../../lib/hono";

export const authRouter = new Hono<HonoEnv>()
  .basePath("/api/auth")
  .get("/me", authMiddleware, (c) => {
    const userSubject = c.get("userSubject");
    const session = c.get("session");
    return c.json({ userSubject, session });
  })
  .get("/authorize", async (c) => {
    const callbackUrl = `${env().NEXT_PUBLIC_BACKEND_URL}/api/auth/callback`;
    const { url: redirectUrl } = await authClient().authorize(
      callbackUrl,
      "code",
    );
    return c.redirect(redirectUrl, 302);
  })
  .get("/callback", async (c) => {
    const pathname = new URL(c.req.url).pathname;
    const code = c.req.query("code");
    if (!code) throw new Error("Missing code");
    const exchanged = await authClient().exchange(
      code,
      `${env().NEXT_PUBLIC_BACKEND_URL}${pathname}`,
    );
    if (exchanged.err)
      return new Response(exchanged.err.toString(), {
        status: 400,
      });
    setSession(exchanged.tokens.access, exchanged.tokens.refresh);

    const verified = await verifySafe({
      access: exchanged.tokens.access,
      refresh: exchanged.tokens.refresh,
    });
    console.log("verified", verified);

    if (verified.err) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userAndTeam = await getUserAndDefaultTeam(verified.value.properties);
    if (!userAndTeam.ok) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.redirect(
      `${env().NEXT_PUBLIC_APP_URL}/dashboard/${userAndTeam.value.team.id}`,
      302,
    );
  })
  .post("/logout", authMiddleware, (c) => {
    deleteCookie(c, "access_token");
    deleteCookie(c, "refresh_token");
    return c.json({ message: "Logged out" }, 200);
  });
