"use client"; // Sidebar interaction requires client components
import {
  ChevronRight,
  FileText,
  LayoutGrid,
  List,
  MessageSquarePlus,
  MessageSquareText,
} from "@galleo/ui/components/icon";
import { BrandLogo } from "@galleo/ui/components/ui/brand-logo";
import { Button } from "@galleo/ui/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@galleo/ui/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@galleo/ui/components/ui/sidebar";

import Link from "next/link";
import { ROUTE_DASHBOARD } from "~/lib/routes";
import type { Session } from "~/lib/server/auth";
import { UserDropdown } from "./user-dropdown";

// Placeholder: Assume we have a function to fetch recent chats
// const fetchRecentChats = async () => {
//   // ... fetch logic ...
//   return [
//     { id: '1', name: 'Chat 1' },
//     { id: '2', name: 'Chat 2' },
//     // ... more chats
//   ];
// };

// Placeholder for recent chats data
const recentChats = [
  { id: "1", name: "Trademark Alpha" },
  { id: "2", name: "Brand Beta Discussion" },
  { id: "3", name: "Logo Gamma Search" },
  // Add more placeholder chats up to 8 if needed
];

export function AppSidebar({
  teamId,
  session,
}: {
  teamId: number;
  session: Session;
}) {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarInset className="py-2">
          <Link href={ROUTE_DASHBOARD(teamId)}>
            <BrandLogo className="flex h-10 w-full justify-center" />
          </Link>
        </SidebarInset>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Assistant Collapsible Submenu */}
            <Collapsible className="w-full">
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-md p-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="flex items-center">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Assistant
                  </span>
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-[data-state=open]:rotate-90" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pt-1 pl-6">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <Button
                        variant="ghost"
                        className="h-8 w-full justify-start text-sm"
                      >
                        <MessageSquarePlus className="mr-2 h-4 w-4" />
                        New Chat
                      </Button>
                    </SidebarMenuItem>
                    {recentChats.map((chat) => (
                      <SidebarMenuItem key={chat.id}>
                        <SidebarMenuButton
                          asChild
                          className="w-full justify-start"
                        >
                          <Link href={`/dashboard/chat/${chat.id}`}>
                            <MessageSquareText className="mr-2 h-4 w-4" />
                            {chat.name}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="w-full justify-start"
                      >
                        <Link href="/dashboard/chat">
                          <List className="mr-2 h-4 w-4" />
                          View All Chats
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Fee Quote Link */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/fee-quote">
                  <FileText className="mr-2 h-4 w-4" />
                  Fee Quote
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserDropdown session={session} />
      </SidebarFooter>
    </Sidebar>
  );
}
