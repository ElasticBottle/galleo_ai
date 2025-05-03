import type { Metadata } from "next";
import { siteConfig } from "./site-config";

function absoluteUrl(path: string) {
  return `${siteConfig.url}${path}`;
}

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = absoluteUrl("/og"),
  ...props
}: {
  title?: string;
  description?: string;
  image?: string;
  [key: string]: Metadata[keyof Metadata];
}): Metadata {
  return {
    title: {
      template: `%s | ${siteConfig.name}`,
      default: siteConfig.name,
    },
    description: description || siteConfig.description,
    keywords: siteConfig.keywords,
    appleWebApp: {
      capable: true,
      title: "Ink & Scribe",
      statusBarStyle: "default",
    },
    openGraph: {
      title,
      description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
      locale: "en_US",
    },
    icons: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/galleo-favicon.svg",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/galleo-favicon.svg",
      },

      {
        rel: "shortcut icon",
        url: "/galleo-favicon.svg",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/galleo-favicon.svg",
      },
    ],
    manifest: "/site.webmanifest",
    metadataBase: new URL(siteConfig.url),
    authors: [
      {
        name: siteConfig.name,
        url: siteConfig.url,
      },
    ],
    ...props,
  };
}
