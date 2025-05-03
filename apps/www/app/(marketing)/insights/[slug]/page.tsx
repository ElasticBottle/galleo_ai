import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentBySlug } from "~/lib/mdx";
import { Section } from "../../_components/section";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const insight = await getContentBySlug("insights", params.slug);

  return {
    title: `${insight.metadata.title} | Galleo`,
    description: insight.metadata.description,
  };
}

export default async function InsightPage({ params }: Props) {
  const insight = await getContentBySlug("insights", params.slug);

  return (
    <Section className="py-16">
      <article className="container mx-auto max-w-3xl px-4">
        <header className="mb-8">
          {insight.metadata.category && (
            <div className="mb-4 text-muted-foreground text-sm uppercase tracking-wider">
              {insight.metadata.category}
            </div>
          )}
          <h1 className="mb-4 font-bold text-4xl">{insight.metadata.title}</h1>
          <p className="mb-4 text-muted-foreground text-xl">
            {insight.metadata.description}
          </p>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            {insight.metadata.author && <span>{insight.metadata.author}</span>}
            {insight.metadata.date && (
              <time dateTime={insight.metadata.date}>
                {new Date(insight.metadata.date).toLocaleDateString()}
              </time>
            )}
            {insight.metadata.readingTime && (
              <span>{insight.metadata.readingTime}</span>
            )}
          </div>
        </header>

        {insight.metadata.image && (
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-lg">
            <img
              src={insight.metadata.image}
              alt={insight.metadata.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MDXRemote source={insight.content} />
        </div>
      </article>
    </Section>
  );
}
