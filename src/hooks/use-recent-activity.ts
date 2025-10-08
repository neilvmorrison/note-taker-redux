"use client";

import { getAllNotes, Note } from "@/lib/notes";
import { getAllProjects, Project } from "@/lib/projects";
import { useEffect, useState } from "react";

export type ActivityItem = {
  id: string;
  title: string;
  type: "note" | "project";
  url: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export default function useRecentActivity(limit: number = 4) {
  const [isLoading, setLoading] = useState(false);
  const [recentNotes, setRecentNotes] = useState<Note[] | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[] | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[] | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRecentActivity() {
      try {
        setLoading(true);

        // Fetch notes and projects in parallel
        const [notes, projects] = await Promise.all([
          getAllNotes({ limit }),
          getAllProjects({ limit }),
        ]);

        setRecentNotes(notes);
        setRecentProjects(projects);

        // Create combined activity feed
        const combinedActivity: ActivityItem[] = [
          ...notes.map(
            (note): ActivityItem => ({
              id: note.id,
              title: note.title ?? "",
              type: "note",
              url: `/notes/${note.id}`,
              createdAt: note.created_at,
              updatedAt: note.updated_at,
            })
          ),
          ...projects.map(
            (project): ActivityItem => ({
              id: project.id,
              title: project.name,
              type: "project",
              url: `/projects/${project.slug}`,
              createdAt: project.created_at,
              updatedAt: project.updated_at,
            })
          ),
        ];

        // Sort by updated_at or created_at, newest first
        combinedActivity.sort((a, b) => {
          const dateA = a.updatedAt || a.createdAt || "";
          const dateB = b.updatedAt || b.createdAt || "";
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });

        setRecentActivity(combinedActivity.slice(0, limit));
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentActivity();
  }, [limit]);

  return {
    recentNotes,
    recentProjects,
    recentActivity,
    isLoading,
    isError: !!error,
    error,
  };
}
