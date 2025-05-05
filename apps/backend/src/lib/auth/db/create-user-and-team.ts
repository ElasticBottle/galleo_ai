import type { UserSubject } from "@galleo/auth/subject";
import { teamTable } from "@galleo/db/schema/team";
import { teamRoleTable } from "@galleo/db/schema/team-role";
import { userTable } from "@galleo/db/schema/user";
import { safe } from "@rectangular-labs/result";
import { getDb } from "../../hono";

export async function createUserAndTeam(user: UserSubject) {
  const db = getDb();
  const result = await safe(() => {
    return db.transaction(async (tx) => {
      const [userResult] = await tx
        .insert(userTable)
        .values({
          username: user.name,
          providerId: user.id,
          email: user.email,
          imageUrl: user.image,
        })
        .returning();
      if (!userResult) {
        throw new Error("Failed to create user");
      }
      const [teamResult] = await tx
        .insert(teamTable)
        .values({
          name: user.name ? `${user.name}'s Team` : "Personal Team",
        })
        .returning();
      if (!teamResult) {
        throw new Error("Failed to create team");
      }
      const [teamRoleResult] = await tx
        .insert(teamRoleTable)
        .values({
          userId: userResult.id,
          teamId: teamResult.id,
          role: "admin",
        })
        .returning();
      if (!teamRoleResult) {
        throw new Error("Failed to create team role");
      }
      return {
        user: userResult,
        teamRoles: [{ ...teamRoleResult, team: teamResult }],
      };
    });
  });
  return result;
}
