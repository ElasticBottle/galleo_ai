"use client"; // Sidebar interaction requires client components
import {
  ChevronRight,
  FileText,
  LayoutGrid,
  List,
  MessageSquarePlus,
  MessageSquareText,
} from "@galleo/ui/components/icon";
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@galleo/ui/components/ui/sidebar";

import Link from "next/link";

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

export function AppSidebar() {
  // Placeholder: Function to handle new chat creation
  const handleNewChat = () => {
    console.log("Creating new chat...");
    // TODO: Implement POST request to backend
    // const response = await fetch('/api/chat', { method: 'POST' });
    // const { chatId } = await response.json();
    // router.push(`/dashboard/chat/${chatId}`);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        {/* You can add a logo or title here */}
        <h2 className="font-semibold text-lg">Galleo AI</h2>
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
                        onClick={handleNewChat}
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
            <SidebarMenuItem className="mt-1">
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
        {/* Optional: Footer content like user profile, settings link etc. */}
      </SidebarFooter>
    </Sidebar>
  );
}
