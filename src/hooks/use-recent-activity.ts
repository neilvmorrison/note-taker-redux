import { getRecentActivity } from "@/lib/recent-activity";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import { Note } from "@/lib/notes";
import { Project } from "@/lib/projects";
import { Chat } from "@/lib/chats";

export enum ActivityType {
  NOTE = "note",
  PROJECT = "project",
  CHAT = "chat",
}

export interface IActivityItem {
  id: string;
  title: string;
  type: ActivityType;
  summary?: string;
  lastViewedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  url: string;
}

export function useRecentActivity() {
  const [data, setData] = useState<{
    notes: Note[];
    projects: Project[];
    chats: Chat[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRecentActivity() {
      try {
        setIsLoading(true);
        const recentActivity = await getRecentActivity();
        setData(recentActivity);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecentActivity();
  }, []);

  const combinedActivity = useMemo(() => {
    if (!data) return { combinedActivity: [], notes: [], chats: [] };
    const combinedActivity: IActivityItem[] = [];

    const noteActivity = data?.notes.map((note) => ({
      id: note.id,
      title: note.title ?? "",
      type: ActivityType.NOTE,
      createdAt: note.created_at ?? "",
      updatedAt: note.updated_at ?? "",
      url: `/notes/${note.id}`,
      lastViewedAt: note.last_viewed_at ?? "",
    }));

    const chatActivity = data?.chats.map((chat) => ({
      id: chat.id,
      title: chat.title ?? "",
      summary: chat.summary ?? "",
      type: ActivityType.CHAT,
      url: `/chat/${chat.id}`,
      createdAt: chat.created_at ?? "",
      updatedAt: chat.updated_at ?? "",
      lastViewedAt: chat.last_viewed_at ?? "",
    }));

    combinedActivity.push(...noteActivity, ...chatActivity);

    return {
      combinedActivity: combinedActivity.sort((a, b) => {
        const dateA = a.lastViewedAt || a.createdAt || "";
        const dateB = b.lastViewedAt || b.createdAt || "";
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      }),
      notes: noteActivity,
      chats: chatActivity,
    };
  }, [data]);

  return {
    data: { ...data, combinedActivity },
    isLoading,
    isError: !!error,
    error,
  };
}
