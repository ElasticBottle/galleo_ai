import { QuoteForm } from "./_components/quote-form";

export default async function FeeQuotePage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  return <QuoteForm teamId={Number.parseInt(teamId)} />;
}
