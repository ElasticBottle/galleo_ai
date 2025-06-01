"use client"; // Sidebar interaction requires client components
import { MessageSquareText, Plus } from "@galleo/ui/components/icon";
import { BrandLogo } from "@galleo/ui/components/ui/brand-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@galleo/ui/components/ui/sidebar";

import type { SelectChat } from "@galleo/db/schema/chat";
import { cn } from "@galleo/ui/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ROUTE_DASHBOARD,
  ROUTE_TRADEMARK_ASSISTANT,
  ROUTE_TRADEMARK_ASSISTANT_CHAT,
} from "~/lib/routes";
import type { Session } from "~/lib/server/auth";
import { UserDropdown } from "./user-dropdown";

export function AppSidebar({
  teamId,
  session,
  chats,
}: {
  teamId: number;
  session: Session;
  chats: SelectChat[];
}) {
  const path = usePathname();
  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <Link
          href={ROUTE_DASHBOARD}
          // show the feedback for posthog
          className={cn("flex pt-4", chats.length > 2 && "show-ph-ff")}
        >
          <BrandLogo className="h-16 w-full" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Past Chats</SidebarGroupLabel>
          <SidebarGroupAction asChild>
            <Link href={ROUTE_TRADEMARK_ASSISTANT(teamId)} prefetch>
              <Plus /> <span className="sr-only">New Project</span>
            </Link>
          </SidebarGroupAction>

          <SidebarGroupContent>
            <SidebarMenu>
              {chats.slice(0, 10).map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      path ===
                      ROUTE_TRADEMARK_ASSISTANT_CHAT({
                        teamId,
                        chatId: chat.id,
                      })
                    }
                  >
                    <Link
                      href={ROUTE_TRADEMARK_ASSISTANT_CHAT({
                        teamId,
                        chatId: chat.id,
                      })}
                      className="min-w-0 truncate"
                      prefetch
                    >
                      <MessageSquareText />
                      {chat.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
