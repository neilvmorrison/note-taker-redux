import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Text } from "./ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserProfile } from "@/lib/auth";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user_profile?: UserProfile;
}

export function AppSidebar({ user_profile, ...props }: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="py-3 md:py-4">
        <Text
          component="h1"
          asChild
          className="text-lg md:text-xl font-semibold"
        >
          <Link href="/">Duley Noted</Link>
        </Text>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Activity</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/profile">This is a note title...</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/profile">This is another note...</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <Link href="/projects">Projects</Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/profile">Sim Racing</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/profile">Blender</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <Link href="/notes">Notes</Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/profile">Sim Racing</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/profile">Blender</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <Link
        className="bg-card p-2.5 md:p-3 flex gap-2 items-center border-t"
        href="/profile"
      >
        <Avatar className="w-8 h-8 md:w-10 md:h-10">
          <AvatarImage src={"https://github.com/shadcn.png"} />
          <AvatarFallback className="text-sm">
            {user_profile?.first_name?.[0] || ""}
            {user_profile?.last_name?.[0] || ""}
          </AvatarFallback>
        </Avatar>
        <div className="overflow-hidden">
          <Text className="text-sm font-medium truncate">
            {user_profile?.first_name}
          </Text>
          <Text className="text-xs truncate" dimmed>
            {user_profile?.email}
          </Text>
        </div>
      </Link>
    </Sidebar>
  );
}
