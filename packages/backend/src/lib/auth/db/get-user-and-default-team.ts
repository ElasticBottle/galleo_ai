import type { UserSubject } from "@galleo/auth/subject";
import { ok, safe } from "@rectangular-labs/result";
import { getDb } from "../../orpc/routers";
import { createUserAndTeam } from "./create-user-and-team";

export async function getUserAndTeams(user: UserSubject) {
  const db = getDb();
  const userResult = await safe(() =>
    db.query.userTable.findFirst({
      where: (table, { eq, and, isNull }) =>
        and(eq(table.providerId, user.id), isNull(table.deletedAt)),
      with: {
        teamRoles: {
          where: (table, { isNull }) => isNull(table.deletedAt),
          orderBy: (table, { asc }) => [asc(table.createdAt)],
          with: {
            team: true,
          },
        },
      },
    }),
  );
  if (!userResult.ok) {
    return userResult;
  }

  if (!userResult.value) {
    return createUserAndTeam(user);
  }
  const { teamRoles, ...userValue } = userResult.value;
  return ok({ user: userValue, teamRoles });
}
