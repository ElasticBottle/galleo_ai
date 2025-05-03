import { buttonVariants } from "@galleo/ui/components/ui/button";
import { cn } from "@galleo/ui/utils/cn";
import Link from "next/link";
import { siteConfig } from "~/lib/site-config";
import { Section } from "./section";

export function Cta() {
  if (!siteConfig.cta) return null;

  return (
    <Section
      id="cta"
      title={siteConfig.cta.title}
      subtitle={siteConfig.cta.subtitle}
      className="bg-primary/10 py-16 xl:rounded-lg"
    >
      <div className="flex w-full items-center justify-center pt-4">
        <Link
          href={siteConfig.cta.href}
          target="_blank"
          className={cn(
            buttonVariants({ variant: "default" }),
            "flex w-full gap-2 sm:w-auto",
          )}
        >
          {siteConfig.cta.buttonText}
        </Link>
      </div>
    </Section>
  );
}
