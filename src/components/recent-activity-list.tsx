"use client";

import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { FileIcon, FolderIcon, MessageCircleIcon } from "lucide-react";
import { IActivityItem } from "@/hooks/use-recent-activity";

interface RecentActivityListProps {
  items: IActivityItem[];
  isLoading?: boolean;
  title: string;
  maxItems?: number;
  className?: string;
  type?: "note" | "project" | "chat" | "all";
}

export function RecentActivityList({
  items,
  isLoading = false,
  title,
  maxItems = 6,
  className,
  type = "all",
}: RecentActivityListProps) {
  // Filter items by type if needed
  const filteredItems =
    items && type !== "all"
      ? items.filter((item) => item.type === type)
      : items;

  // Limit the number of items shown
  const displayItems = filteredItems?.slice(0, maxItems);

  return (
    <div
      className={cn("overflow-y-auto max-h-[220px] scrollbar-thin", className)}
    >
      <SidebarMenu>
        {isLoading &&
          Array(3)
            .fill(0)
            .map((_, index) => (
              <SidebarMenuSkeleton key={index} showIcon={true} />
            ))}

        {!isLoading && (!displayItems || displayItems.length === 0) && (
          <div className="px-2 py-2 text-xs text-muted-foreground">
            No {title.toLowerCase()} found
          </div>
        )}

        {!isLoading &&
          displayItems?.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild>
                <Link href={item.url} className="flex items-center gap-2">
                  {item.type === "note" ? (
                    <FileIcon className="h-4 w-4 shrink-0" />
                  ) : item.type === "project" ? (
                    <FolderIcon className="h-4 w-4 shrink-0" />
                  ) : item.type === "chat" ? (
                    <MessageCircleIcon className="h-4 w-4 shrink-0" />
                  ) : (
                    <FileIcon className="h-4 w-4 shrink-0" />
                  )}
                  <span className="truncate">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
      </SidebarMenu>
    </div>
  );
}
