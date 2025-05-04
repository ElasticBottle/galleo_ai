import type { UserSubject } from "@galleo/auth/subject";
import type { SelectTeam } from "@galleo/db/schema/team";
import type { SelectTeamRole } from "@galleo/db/schema/team-role";
import type { SelectUser } from "@galleo/db/schema/user";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verifySafe } from "./client";
import { getUserAndDefaultTeam } from "./db/get-user-and-default-team";

export const authMiddleware = createMiddleware<{
  Variables: {
    userSubject: UserSubject;
    session: {
      user: SelectUser;
      team: SelectTeam;
      teamRole: SelectTeamRole;
    };
  };
}>(async (c, next) => {
  const access = getCookie(c, "access_token");
  const refresh = getCookie(c, "refresh_token");
  if (!access || !refresh) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const verified = await verifySafe({ access, refresh });
  if (verified.err) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  c.set("userSubject", verified.value.properties);

  const userAndTeam = await getUserAndDefaultTeam(verified.value.properties);
  if (!userAndTeam.ok) {
    console.error(
      "[Auth middleware]: Error getting user and default team",
      userAndTeam.error,
    );
    return c.json({ error: "Internal server error" }, 500);
  }
  c.set("session", userAndTeam.value);
  return await next();
});
