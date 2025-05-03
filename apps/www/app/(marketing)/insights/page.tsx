import type { Metadata } from "next";
import Link from "next/link";
import { type Content, getAllContent } from "~/lib/mdx";
import { Section } from "../_components/section";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Explore our collection of insights on the latest developments in IP law, AI, and the intersection of law and AI",
};

export default async function InsightsPage() {
  const insights = await getAllContent("insights");

  return (
    <Section className="py-16">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-12 flex items-baseline justify-between">
          <h1 className="font-bold text-4xl">Insights</h1>
          <p className="text-muted-foreground">
            Explore our collection of insights on the latest developments in IP
            law, AI, and the intersection of law and AI
          </p>
        </div>
        <div className="grid gap-8">
          {insights.map((article: Content) => (
            <Link
              key={article.slug}
              href={`/insights/${article.slug}`}
              className="group block overflow-hidden rounded-lg border border-border bg-white transition-colors hover:border-border-hover dark:bg-white/5"
            >
              <div className="flex flex-col md:flex-row">
                {article.metadata.image && (
                  <div className="relative md:w-1/3">
                    <div className="relative aspect-[4/3] md:aspect-[3/3]">
                      <img
                        src={article.metadata.image}
                        alt={article.metadata.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  </div>
                )}
                <div className="p-8 md:w-2/3">
                  <div className="mb-3 text-muted-foreground text-xs uppercase tracking-wider">
                    {article.metadata.category || "INSIGHTS"}
                  </div>
                  <h2 className="mb-3 font-semibold text-2xl transition-colors group-hover:text-primary">
                    {article.metadata.title}
                  </h2>
                  <p className="mb-6 line-clamp-2 text-muted-foreground">
                    {article.metadata.description}
                  </p>
                  <div className="flex items-center gap-4 text-muted-foreground text-sm">
                    {article.metadata.author && (
                      <span>{article.metadata.author}</span>
                    )}
                    {article.metadata.date && (
                      <time dateTime={article.metadata.date}>
                        {new Date(article.metadata.date).toLocaleDateString()}
                      </time>
                    )}
                    <span>{article.metadata.readingTime || "3 min read"}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
