import {
  SidebarProvider,
  SidebarTrigger,
} from "@galleo/ui/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";

export default function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6">
          <SidebarTrigger className="mb-4" />{" "}
          {/* Add some margin below the trigger */}
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
