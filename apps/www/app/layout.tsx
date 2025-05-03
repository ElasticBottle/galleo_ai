import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Manrope, Playfair_Display } from "next/font/google";
import { getQueryClient } from "~/lib/client/react-query";
import { constructMetadata } from "~/lib/metadata";
import { Providers } from "./providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = constructMetadata({});

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  initialScale: 1,
  width: "device-width",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${playfair.variable} ${geist.variable} ${geistMono.variable} min-h-screen w-full scroll-smooth antialiased`}
    >
      <body>
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}
