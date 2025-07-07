import {
  SidebarProvider,
  SidebarTrigger,
} from "@galleo/ui/components/ui/sidebar";
import { safe } from "@rectangular-labs/result";
import { cookies } from "next/headers";
import { getApi } from "~/lib/server/api";
import { ensureSession } from "~/lib/server/auth";
import { AppSidebar } from "./_components/app-sidebar";

export default async function DashboardLayout({
  children,
  params,
}: { children: React.ReactNode; params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  const session = await ensureSession(Number.parseInt(teamId));

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const chatsResponse = await safe(async () =>
    (await getApi()).chat.getChats({
      teamId,
    }),
  );
  if (!chatsResponse.ok) {
    return <div>Failed to get chats</div>;
  }
  const { chats } = chatsResponse.value;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar
        teamId={Number.parseInt(teamId)}
        session={session}
        chats={chats}
      />
      <main className="relative flex h-full min-h-screen w-full flex-col">
        <SidebarTrigger className="absolute top-2 left-2 z-10" />
        {children}
      </main>
    </SidebarProvider>
  );
}
