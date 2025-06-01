"use client";

import { ThemeToggle } from "@galleo/ui/components/theme-provider";
import { buttonVariants } from "@galleo/ui/components/ui/button";
import { cn } from "@galleo/ui/utils/cn";
import Link from "next/link";
import { type HeaderButtonConfig, siteConfig } from "~/lib/site-config";

export function ActionButtons() {
  const actionItems = siteConfig.header
    .filter(
      (item): item is HeaderButtonConfig =>
        item.variant === "button" && item.buttonVariant !== "navigation",
    )
    .map((item) => (
      <Link
        key={item.label}
        href={item.href}
        data-attr={`header-button-${item.label}`}
        className={cn(
          buttonVariants({
            variant:
              item.buttonVariant === "navigation"
                ? "default"
                : item.buttonVariant,
            size: item.size || "default",
          }),
          // Custom styling for Try Galleo Today button
          item.label === "Try Galleo Today" &&
            "bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300",
        )}
        target={item.target}
      >
        {item.label}
      </Link>
    ));

  return (
    <div className="flex items-center gap-4">
      {actionItems}
      <ThemeToggle />
    </div>
  );
}
