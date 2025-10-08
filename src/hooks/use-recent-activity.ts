"use client";

import useNotes from "./use-notes";
import useProjects from "./use-projects";
import { useMemo } from "react";

export type ActivityItem = {
  id: string;
  title: string;
  type: "note" | "project";
  url: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export default function useRecentActivity(limit: number = 4) {
  // Leverage existing hooks that already fetch user-specific data
  const {
    data: notes,
    isLoading: notesLoading,
    isError: notesError,
    error: notesErrorObj,
  } = useNotes();
  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
    error: projectsErrorObj,
  } = useProjects();

  // Combined loading and error states
  const isLoading = notesLoading || projectsLoading;
  const isError = notesError || projectsError;
  const error = notesErrorObj || projectsErrorObj;

  // Memoize the activity computation to avoid unnecessary recalculations
  const { recentActivity, recentNotes, recentProjects } = useMemo(() => {
    // Default values if data isn't loaded yet
    if (!notes || !projects) {
      return {
        recentActivity: null,
        recentNotes: null,
        recentProjects: null,
      };
    }

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

    return {
      recentActivity: combinedActivity.slice(0, limit),
      recentNotes: notes.slice(0, limit),
      recentProjects: projects.slice(0, limit),
    };
  }, [notes, projects, limit]);

  return {
    recentNotes,
    recentProjects,
    recentActivity,
    isLoading,
    isError,
    error,
  };
}
