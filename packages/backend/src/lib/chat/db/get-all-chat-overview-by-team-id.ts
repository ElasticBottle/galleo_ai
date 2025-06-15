import { ok, safe } from "@rectangular-labs/result";
import { getDb } from "../../orpc/routers";

export async function getAllChatOverviewByTeamId(teamId: number) {
  const db = getDb();
  const result = await safe(() =>
    db.query.chatTable.findMany({
      where: (table, { eq, and, isNull }) =>
        and(eq(table.teamId, teamId), isNull(table.deletedAt)),
      orderBy: (table, { desc }) => [desc(table.updatedAt)],
    }),
  );

  if (!result.ok) {
    console.error(
      `Failed to get chat overviews for team ${teamId}:`,
      result.error,
    );
    return result;
  }

  return ok(result.value);
}
