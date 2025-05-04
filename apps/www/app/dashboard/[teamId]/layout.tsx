import {
  SidebarProvider,
  SidebarTrigger,
} from "@galleo/ui/components/ui/sidebar";
import { AppSidebar } from "~/app/dashboard/[teamId]/_components/app-sidebar";
import { ensureSession } from "~/lib/server/auth";

export default async function DashboardLayout({
  children,
  params,
}: { children: React.ReactNode; params: Promise<{ teamId: number }> }) {
  const { teamId } = await params;
  const session = await ensureSession();
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar teamId={teamId} session={session} />
        <main className="h-full w-full flex-1 p-4 md:p-6">
          <SidebarTrigger /> {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
