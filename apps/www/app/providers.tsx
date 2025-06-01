"use client";
import { ThemeProvider } from "@galleo/ui/components/theme-provider";
import { Toaster } from "@galleo/ui/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useParams } from "next/navigation";
import { PostHogProvider } from "posthog-js/react";
import * as React from "react";
import {
  getPosthog,
  posthogGroup,
  posthogIdentify,
} from "~/lib/client/posthog";
import { getQueryClient } from "~/lib/client/react-query";
import type { Session } from "~/lib/server/auth";

export function Providers({
  children,
  session,
}: { children: React.ReactNode; session: Session }) {
  const queryClient = getQueryClient();
  const posthog = getPosthog();
  const params = useParams();

  React.useEffect(() => {
    if (session.userSubject) {
      posthogIdentify(session.userSubject.id.toString(), {
        email: session.session.user.email,
        username: session.session.user.username,
        joinedAt: session.session.user.createdAt,
      });
      if (params.teamId) {
        posthogGroup("team", params.teamId.toString(), {
          name: session.session.teamRoles.find(
            (teamRole) => teamRole.team.id === Number(params.teamId),
          )?.team.name,
        });
      }
    }
  }, [session, params.teamId]);

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
