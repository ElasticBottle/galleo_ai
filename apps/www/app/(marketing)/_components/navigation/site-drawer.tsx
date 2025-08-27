import { Menu } from "@galleo/ui/components/icon";
import { ThemeToggle } from "@galleo/ui/components/theme-provider";
import { Button } from "@galleo/ui/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@galleo/ui/components/ui/drawer";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "~/lib/site-config";
import { BrandButton } from "./brand-button";

export function SiteDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isOfferPage = pathname === "/offer";

  const handleNavClick = (url: string | undefined) => {
    // Close drawer first
    setIsOpen(false);

    // If there's a hash, scroll to the element after drawer closes
    if (url?.includes("#")) {
      setTimeout(() => {
        const element = document.querySelector(url);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 300); // Adjust timeout based on your drawer's close animation duration
    } else if (url) {
      router.push(url);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger>
        <Menu className="text-2xl" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="px-6">
          <DrawerTitle className="sr-only">{siteConfig.name}</DrawerTitle>
          <DrawerDescription className="sr-only">mobile menu</DrawerDescription>
          <div className="flex items-center justify-between">
            <BrandButton />
            <ThemeToggle />
          </div>
          <nav>
            <ul className="pt-7 text-left">
              {siteConfig.header
                .filter((item) => {
                  // Hide "Try Galleo Today" button on offer page
                  if (isOfferPage && item.variant === "button" && item.label === "Try Galleo Today") {
                    return false;
                  }
                  return true;
                })
                .map((item) => {
                  if (item.variant === "dropdown") {
                    return null;
                  }
                  return (
                    <li key={item.label} className="py-1.5">
                      <Button
                        className="font-semibold"
                        onClick={() => handleNavClick(item.href)}
                        variant={
                          item.buttonVariant === "navigation"
                            ? "ghost"
                            : item.buttonVariant
                        }
                        data-attr={`site-drawer-${item.label}`}
                      >
                        {item.label}
                      </Button>
                    </li>
                  );
                })}
            </ul>
          </nav>
        </DrawerHeader>
        <DrawerFooter>{/* <CtaButton withLogo /> */}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
