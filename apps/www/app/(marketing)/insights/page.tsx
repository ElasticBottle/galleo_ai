import type { Metadata } from "next";
import { getAllContent } from "~/lib/mdx";
import ClientBlogGrid from "./_components/ClientBlogGrid";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Explore our collection of insights on the latest developments in IP law, AI, and the intersection of law and AI",
};
export default async function InsightsPage() {
  const articles = await getAllContent("insights");
  return <ClientBlogGrid articles={articles} />;
}
