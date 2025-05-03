import { ChevronRight } from "@galleo/ui/components/icon";
import Link from "next/link";
import { siteConfig } from "~/lib/site-config";
import { BrandButton } from "./navigation/brand-button";

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-6xl px-5 py-16 pb-0 sm:px-10">
        <BrandButton />

        <div className="grid pt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {siteConfig.footer.items.map((section) => (
            <div key={section.title} className="mb-5">
              <h2 className="font-semibold">{section.title}</h2>
              <ul>
                {section.links.map((link) => (
                  <li key={link.text} className="my-2">
                    <Link
                      href={link.href}
                      className="group inline-flex cursor-pointer items-center justify-start gap-1 text-muted-foreground duration-200 hover:text-foreground hover:opacity-90"
                    >
                      {link.icon && link.icon}
                      {link.text}
                      <ChevronRight className="size-4 translate-x-0 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto grid size-full max-w-6xl grid-cols-1 justify-between gap-1 border-t py-2 md:grid-cols-2">
          <span className="text-foreground text-sm tracking-tight">
            Copyright © {new Date().getFullYear()}{" "}
            <Link href="/" className="cursor-pointer">
              {"Galleo AI Pte. Ltd."}
            </Link>
          </span>
          <ul className="flex justify-start text-foreground text-sm tracking-tight md:justify-end">
            {siteConfig.footer.termsOfUseAndPrivacyPolicy && (
              <li className="mr-3 md:mx-4">
                <Link
                  href={siteConfig.footer.termsOfUseAndPrivacyPolicy}
                  target="_blank"
                >
                  Terms of Use and Privacy Policy
                </Link>
              </li>
            )}
            {siteConfig.footer.privacyPolicy && (
              <li className="mr-3 md:mx-4">
                <Link href={siteConfig.footer.privacyPolicy} target="_blank">
                  Privacy Policy
                </Link>
              </li>
            )}
            {siteConfig.footer.termsOfService && (
              <li className="mr-3 md:mx-4">
                <Link href={siteConfig.footer.termsOfService} target="_blank">
                  Terms of Service
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </footer>
  );
}
