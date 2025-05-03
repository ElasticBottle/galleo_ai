"use client";
import { ThemeProvider } from "@galleo/ui/components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PostHogProvider } from "posthog-js/react";
import type * as React from "react";
import { getPosthog } from "~/lib/client/posthog";
import { getQueryClient } from "~/lib/client/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const posthog = getPosthog();

  return (
    <PostHogProvider client={posthog}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ThemeProvider>
    </PostHogProvider>
  );
}
