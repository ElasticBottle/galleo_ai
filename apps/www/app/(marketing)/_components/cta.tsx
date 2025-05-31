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
            "rounded-md px-6 py-4 font-medium text-lg shadow-sm transition-colors",
            "flex w-full items-center justify-center gap-3 sm:w-auto",
            // Custom styling for better contrast with orange logo
            "bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-slate-900"
          )}
        >
          Try Galleo Today
        </Link>
      </div>
    </Section>
  );
}
