"use client";

import { ThemeToggle } from "@galleo/ui/components/theme-provider";
import { buttonVariants } from "@galleo/ui/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@galleo/ui/components/ui/navigation-menu";
import { cn } from "@galleo/ui/utils/cn";
import Link from "next/link";
import {
  type HeaderButtonConfig,
  type HeaderDropdownConfig,
  siteConfig,
} from "~/lib/site-config";

export function SiteMenu() {
  const body = siteConfig.header.map((item) => {
    if (item.variant === "button") {
      return (
        <SiteMenuButton
          key={item.label}
          href={item.href}
          label={item.label}
          buttonVariant={item.buttonVariant}
          target={item.target}
        />
      );
    }

    if (item.variant === "dropdown") {
      return (
        <SiteMenuDropdown
          key={item.label}
          label={item.label}
          main={item.content.main}
          items={item.content.items}
        />
      );
    }
    return null;
  });
  return (
    <div className="flex items-center space-x-10">
      <NavigationMenu>
        <NavigationMenuList>{body}</NavigationMenuList>
      </NavigationMenu>

      {/* <CtaButton withLogo /> */}
      <ThemeToggle />
    </div>
  );
}

function SiteMenuButton({
  href,
  label,
  target,
  buttonVariant,
}: {
  href: HeaderButtonConfig["href"];
  label: HeaderButtonConfig["label"];
  target: HeaderButtonConfig["target"];
  buttonVariant: HeaderButtonConfig["buttonVariant"];
}) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        data-attr={`header-button-${label}`}
        className={
          buttonVariant === "navigation"
            ? navigationMenuTriggerStyle()
            : buttonVariants({ variant: buttonVariant })
        }
        target={target}
      >
        {label}
      </Link>
    </NavigationMenuLink>
  );
}

function SiteMenuDropdown({
  label,
  main,
  items,
}: {
  label: HeaderDropdownConfig["label"];
  main: HeaderDropdownConfig["content"]["main"];
  items: HeaderDropdownConfig["content"]["items"];
}) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{label}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul
          className={`grid select-none gap-3 p-6 ${
            main
              ? "md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]"
              : "w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]"
          }`}
        >
          {main && (
            <li className="row-span-3">
              <NavigationMenuLink asChild>
                <Link
                  className="flex size-full flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 outline-none focus:shadow-md"
                  href={main.href}
                >
                  {main.icon}
                  <div className="pt-4 pb-2 font-medium text-lg">
                    {main.title}
                  </div>
                  <p className="text-muted-foreground text-sm leading-tight">
                    {main.description}
                  </p>
                </Link>
              </NavigationMenuLink>
            </li>
          )}
          {items?.map((item) => (
            <li key={item.title}>
              <NavigationMenuLink asChild>
                <a
                  href={item.href}
                  className={cn(
                    "block space-y-1 rounded-md p-3 outline-none transition-colors hover:bg-primary/10 focus:bg-primary/10 ",
                  )}
                >
                  <div className="font-medium text-sm leading-none">
                    {item.title}
                  </div>
                  <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
                    {item.description}
                  </p>
                </a>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
