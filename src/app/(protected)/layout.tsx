import { AppSidebar } from "@/components/app-sidebar";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import LogoutButton from "@/components/logout-button";
import SearchDialog from "@/components/search-dialog";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/authentication");
  }
  return (
    <SidebarProvider>
      <AppSidebar user_profile={currentUser} />
      <SidebarInset>
        <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 border-b px-3 md:px-4">
          <SidebarTrigger className="-ml-0.5 md:-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-1 md:mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex items-center justify-between w-full">
            <BreadcrumbNav
              className="text-sm md:text-base"
              labels={{
                notes: "Notes",
                projects: "Projects",
                profile: "User Profile",
                tasks: "Tasks",
                chats: "Chats",
              }}
            />
            <SearchDialog />
          </div>
          <div className="ml-auto hidden gap-3 items-center lg:flex">
            <Separator
              orientation="vertical"
              className="mr-1 md:mr-2 data-[orientation=vertical]:h-6"
            />
            <LogoutButton className="ml-auto cursor-pointer" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-3 md:gap-4 p-3 md:p-4 overflow-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
