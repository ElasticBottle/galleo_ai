"use client";
import { ThemeProvider } from "@galleo/ui/components/theme-provider";
import { Toaster } from "@galleo/ui/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PostHogProvider } from "posthog-js/react";
import type * as React from "react";
import { getPosthog } from "~/lib/client/posthog";
import { getQueryClient } from "~/lib/client/react-query";
import type { Session } from "~/lib/server/auth";

export function Providers({
  children,
}: { children: React.ReactNode; session: Session }) {
  const queryClient = getQueryClient();
  const posthog = getPosthog();

  return (
    <PostHogProvider client={posthog}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools />
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </PostHogProvider>
  );
}
