"use client";

import { ThemeToggle } from "@galleo/ui/components/theme-provider";
import { buttonVariants } from "@galleo/ui/components/ui/button";
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
        className={buttonVariants({
          variant:
            item.buttonVariant === "navigation"
              ? "default"
              : item.buttonVariant,
        })}
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
