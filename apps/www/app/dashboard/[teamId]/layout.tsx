import {
  SidebarProvider,
  SidebarTrigger,
} from "@galleo/ui/components/ui/sidebar";
import { cookies } from "next/headers";
import { ensureSession } from "~/lib/server/auth";
import { backend } from "~/lib/server/backend";
import { AppSidebar } from "./_components/app-sidebar";

export default async function DashboardLayout({
  children,
  params,
}: { children: React.ReactNode; params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  const session = await ensureSession(Number.parseInt(teamId));

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const chatsResponse = await (await backend()).api[":teamId"].chat.$get({
    param: { teamId },
  });
  if (!chatsResponse.ok) {
    return <div>Failed to get chats</div>;
  }
  const chats = await chatsResponse.json();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar
        teamId={Number.parseInt(teamId)}
        session={session}
        chats={chats.map((chat) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          deletedAt: chat.deletedAt ? new Date(chat.deletedAt) : null,
        }))}
      />
      <main className="relative flex h-full min-h-screen w-full flex-col">
        <SidebarTrigger className="absolute top-2 left-2 z-10" />
        {children}
      </main>
    </SidebarProvider>
  );
}
