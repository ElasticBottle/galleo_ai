import { safe, safeFetch } from "@rectangular-labs/result";
import { Hono } from "hono";
import { authClient, verifySafe } from "../../../lib/auth/client";
import { getUserAndTeams } from "../../../lib/auth/db/get-user-and-default-team";
import { authMiddleware } from "../../../lib/auth/middleware";
import { deleteSession, setSession } from "../../../lib/auth/session";
import { arrayBufferToBase64 } from "../../../lib/auth/util";
import { env } from "../../../lib/env";
import type { HonoEnv } from "../../../lib/hono";

export const authRouter = new Hono<HonoEnv>()
  .basePath("/api/auth")
  .get("/me", authMiddleware, (c) => {
    const userSubject = c.get("userSubject");
    const session = c.get("session");
    console.log("me", { userSubject });

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
    if (verified.err) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userProperties = verified.value.properties;
    if (userProperties?.id?.startsWith("microsoft_")) {
      const [url, accessToken] = userProperties.image?.split("#") ?? [];
      if (!url || !accessToken) {
        return c.json({ error: "Unauthorized" }, 401);
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
      return c.json({ error: "Unauthorized" }, 401);
    }

    const teamId = userAndTeam.value.teamRoles[0]?.team.id;
    if (!teamId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.redirect(`${env().NEXT_PUBLIC_APP_URL}/dashboard/${teamId}`, 302);
  })
  .post("/logout", authMiddleware, (c) => {
    const deleted = deleteSession();
    console.log("deleted", deleted);
    return c.json({ message: deleted ? "OK" : "No Session" }, 200);
  });
