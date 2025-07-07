"use client";

import { ChevronsUpDown, HelpCircle, LogOut } from "@galleo/ui/components/icon";
import { ThemeToggle } from "@galleo/ui/components/theme-provider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@galleo/ui/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@galleo/ui/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@galleo/ui/components/ui/sidebar";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiOptions } from "~/lib/client/api";
import { posthogReset } from "~/lib/client/posthog";
import type { Session } from "~/lib/server/auth";

function UserDetails({ session }: { session: Session }) {
  const { session: sessionData } = session;
  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage
          src={sessionData?.user.imageUrl ?? undefined}
          alt={sessionData?.user.username ?? undefined}
        />
        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">
          {sessionData?.user.username}
        </span>
        <span className="truncate text-xs">{sessionData?.user.email}</span>
      </div>
    </>
  );
}

export function UserDropdown({
  session,
}: {
  session: Session;
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { mutate: signOut, isPending: isSigningOut } = useMutation(
    apiOptions.auth.logout.mutationOptions({
      onSuccess: () => {
        posthogReset();
        router.refresh();
      },
      onError: () => {
        console.error("Failed to sign out");
      },
    }),
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              disabled={isSigningOut}
            >
              <UserDetails session={session} />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserDetails session={session} />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ThemeToggle
              className="w-full justify-start px-2 py-1.5 font-normal [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0"
              variant="ghost"
            >
              Toggle Theme
            </ThemeToggle>
            <DropdownMenuItem onClick={() => signOut({})}>
              <LogOut />
              Log out
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                Learn More
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    Terms of Service
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    Privacy Policy
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
