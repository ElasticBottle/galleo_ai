import type { UserSubject } from "@galleo/auth/subject";
import { err, ok, safe } from "@rectangular-labs/result";
import { getDb } from "../../hono";
import { createUserAndTeam } from "./create-user-and-team";

export async function getUserAndDefaultTeam(user: UserSubject) {
  const db = getDb();
  const userResult = await safe(() =>
    db.query.userTable.findFirst({
      where: (table, { eq, and, isNull }) =>
        and(eq(table.providerId, user.id), isNull(table.deletedAt)),
      with: {
        teamRoles: {
          where: (table, { isNull }) => isNull(table.deletedAt),
          orderBy: (table, { asc }) => [asc(table.createdAt)],
          limit: 1,
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
  const {
    teamRoles: [teamRoleResult],
    ...userValue
  } = userResult.value;
  if (!teamRoleResult) {
    return err(new Error("No team found."));
  }
  const { team, ...teamRole } = teamRoleResult;
  return ok({ user: userValue, team, teamRole });
}
