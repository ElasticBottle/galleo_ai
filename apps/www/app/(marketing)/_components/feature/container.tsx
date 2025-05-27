import type { ReactNode } from "react";
import { siteConfig } from "~/lib/site-config";
import { Section } from "../section";

type Position = "left" | "right";

interface FeatureSectionProps {
  label: string;
  title: ReactNode;
  description: ReactNode;
  ctaText: string;
  showcaseContent: ReactNode;
  position?: Position;
}

export function FeatureSection({
  label,
  title,
  description,
  ctaText,
  showcaseContent,
  position = "right",
}: FeatureSectionProps) {
  const ContentSection = (
    <div className="flex h-full items-center bg-muted px-4 py-10 md:px-12 md:py-24 lg:px-24">
      <div className="max-w-xl">
        <span className="font-medium text-muted-foreground text-sm">
          {label}
        </span>
        <h2 className="mt-6 font-medium text-5xl text-foreground leading-tight">
          {title}
        </h2>
        <div className="mt-6 text-lg text-muted-foreground">{description}</div>
        <a
          href={siteConfig.links.talkToUs}
          data-attr={ctaText}
          target="_blank"
          className="mt-8 flex items-center font-medium text-muted-foreground text-sm hover:text-foreground"
          rel="noreferrer"
        >
          {ctaText} &rarr;
        </a>
      </div>
    </div>
  );

  const ShowcaseSection = (
    <div className="flex h-full items-center bg-foreground px-4 py-24 md:px-12 lg:px-24">
      {showcaseContent}
    </div>
  );

  return (
    <Section>
      <div className="grid w-full overflow-hidden md:grid-cols-2 xl:rounded-lg">
        {/* On mobile, ShowcaseSection is always first */}
        <div className="md:hidden">{ShowcaseSection}</div>
        <div className="md:hidden">{ContentSection}</div>

        {/* On desktop, order depends on position prop */}
        <div className="hidden md:block">
          {position === "left" ? ShowcaseSection : ContentSection}
        </div>
        <div className="hidden md:block">
          {position === "left" ? ContentSection : ShowcaseSection}
        </div>
      </div>
    </Section>
  );
}
