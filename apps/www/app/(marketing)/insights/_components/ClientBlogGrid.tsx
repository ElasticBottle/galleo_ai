"use client";
import Link from "next/link";
import { useState } from "react";
import type { Content } from "~/lib/mdx";

// Category explainers (fill in as needed)
const CATEGORY_EXPLAINERS: Record<string, string> = {
  "AI Legal Developments":
    "Stay informed on the legal frontlines of artificial intelligence. Get the latest on key cases, regulations, and the critical discussions shaping the future of AI's use and governance",
  "Transforming Law with AI":
    "Explore the cutting edge of legal innovation. Learn how AI is revolutionizing legal practice, from automating tasks to creating entirely new ways of delivering services",
  "Trademark Basics":
    "Protect your brand's core identity. Discover essential guides and practical advice on understanding, securing, and managing your trademarks for business success in today's market.",
  // Add more as needed, or use a placeholder:
  // "Other Category": "Description for this category.",
};

export default function ClientBlogGrid({ articles }: { articles: Content[] }) {
  // Sort by date descending
  const sorted = [...articles].sort(
    (a, b) =>
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime(),
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Get unique categories
  const categories = Array.from(
    new Set(sorted.map((a) => a.metadata.category).filter(Boolean)),
  ) as string[];

  // Hero article is the most recent (or most recent in selected category)
  const hero = sorted[0];
  const gridArticles = selectedCategory
    ? sorted.filter((a) => a.metadata.category === selectedCategory)
    : sorted;

  // Pagination
  const ARTICLES_PER_PAGE = 18;
  const totalPages = Math.ceil(gridArticles.length / ARTICLES_PER_PAGE);
  const paginatedArticles = gridArticles.slice(
    (page - 1) * ARTICLES_PER_PAGE,
    page * ARTICLES_PER_PAGE,
  );

  // Reset to page 1 when category changes
  function handleCategoryChange(cat: string | null) {
    setSelectedCategory(cat);
    setPage(1);
  }

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Insights H1 */}
        <h1 className="mb-8 text-center font-bold text-5xl text-foreground">
          Insights
        </h1>
        {/* Most Recent Article */}
        <h2 className="mb-4 text-center font-semibold text-3xl text-foreground">
          Most Recent Article
        </h2>
        {hero && (
          <section className="mb-12 w-full">
            <Link href={`/insights/${hero.slug}`}>
              <div className="group relative cursor-pointer overflow-hidden rounded-xl shadow-lg">
                {hero.metadata.image && (
                  <img
                    src={hero.metadata.image}
                    alt={hero.metadata.title}
                    className="w-full object-cover"
                    style={{ maxHeight: 400, minHeight: 280 }}
                  />
                )}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-4">
                  <span className="mb-2 inline-block w-fit rounded-full bg-primary px-3 py-1 text-white text-xs">
                    {hero.metadata.category}
                  </span>
                  <h2
                    className="mb-2 break-words font-bold text-white text-xl sm:text-2xl md:text-3xl"
                    style={{
                      wordBreak: "break-word",
                      hyphens: "auto",
                    }}
                  >
                    {hero.metadata.title}
                  </h2>
                  <p className="line-clamp-2 text-sm text-white sm:text-base">
                    {hero.metadata.description}
                  </p>
                  <div className="mt-2 text-sm text-white/70">
                    {hero.metadata.readingTime || "3 min read"}
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Categories Signpost */}
        <h2 className="mb-2 py-4 text-center font-semibold text-3xl text-foreground">
          Article Categories
        </h2>
        <nav className="mb-4 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            className={`rounded-full px-4 py-2 font-medium border transition-colors ${
              !selectedCategory
                ? "bg-primary text-white border-primary"
                : "bg-muted text-muted-foreground border-border hover:border-primary/50"
            }`}
            onClick={() => handleCategoryChange(null)}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              className={`rounded-full px-4 py-2 font-medium border transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-muted text-muted-foreground border-border hover:border-primary/50"
              } w-fit`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Category Explainer */}
        {selectedCategory && (
          <div className="mb-6 text-center text-muted-foreground">
            {CATEGORY_EXPLAINERS[selectedCategory] || (
              <span>
                [Add a description for <b>{selectedCategory}</b> here.]
              </span>
            )}
          </div>
        )}

        {/* Article Grid */}
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {paginatedArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/insights/${article.slug}`}
              className="block rounded-lg border border-border bg-white transition hover:shadow-lg dark:bg-white/5"
            >
              {article.metadata.image && (
                <img
                  src={article.metadata.image}
                  alt={article.metadata.title}
                  className="h-40 w-full rounded-t-lg object-cover"
                />
              )}
              <div className="p-4">
                <span className="mb-2 inline-block w-fit rounded bg-primary/10 px-2 py-1 text-primary text-xs">
                  {article.metadata.category}
                </span>
                <h3 className="mb-1 font-semibold text-lg">
                  {article.metadata.title}
                </h3>
                <div className="text-muted-foreground text-xs">
                  {article.metadata.readingTime || "3 min read"}
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                type="button"
                className={`rounded px-3 py-1 ${
                  page === i + 1
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(i + 1);
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
