import { ensureSession } from "~/lib/server/auth";
import { QuoteForm } from "./_components/quote-form";

export default async function FeeQuotePage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  await ensureSession(Number.parseInt(teamId));
  return <QuoteForm teamId={Number.parseInt(teamId)} />;
}
