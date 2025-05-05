"use client"; // Sidebar interaction requires client components
import { FileText, MessageSquareText } from "@galleo/ui/components/icon";
import { BrandLogo } from "@galleo/ui/components/ui/brand-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@galleo/ui/components/ui/sidebar";

import Link from "next/link";
import {
  ROUTE_DASHBOARD,
  ROUTE_FEE_QUOTE,
  ROUTE_TRADEMARK_ASSISTANT,
} from "~/lib/routes";
import type { Session } from "~/lib/server/auth";
import { UserDropdown } from "./user-dropdown";

export function AppSidebar({
  teamId,
  session,
}: {
  teamId: number;
  session: Session;
}) {
  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <Link
          href={ROUTE_DASHBOARD}
          className="flex justify-center pt-4 invert dark:invert-0"
        >
          <BrandLogo className="flex h-10 w-full justify-center" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Assistant Collapsible Submenu */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={ROUTE_TRADEMARK_ASSISTANT(teamId)} prefetch>
                    <MessageSquareText />
                    Trademark Assistant
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Fee Quote Link */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={ROUTE_FEE_QUOTE(teamId)} prefetch>
                    <FileText />
                    Fee Quote
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserDropdown session={session} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
