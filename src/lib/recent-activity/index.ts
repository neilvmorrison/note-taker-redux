"use server";

import { getCurrentUser } from "../auth";
import { createClient } from "../supabase/server";

export async function getRecentActivity() {
  const sb = await createClient();
  const currentUser = await getCurrentUser();

  if (!currentUser) throw new Error("User Not Found");

  const { data: notes, error: notesError } = await sb
    .from("notes")
    .select("*")
    .eq("author_id", currentUser.id)
    .order("last_viewed_at", { ascending: false })
    .range(0, 4);
  if (notesError) throw notesError;
  const { data: projects, error: projectsError } = await sb
    .from("projects")
    .select("*")
    .eq("owner_id", currentUser.id)
    .order("last_viewed_at", { ascending: false })
    .range(0, 4);
  if (projectsError) throw projectsError;
  const { data: chats, error: chatsError } = await sb
    .from("chats")
    .select("*")
    .eq("user_profile_id", currentUser.id)
    .order("last_viewed_at", { ascending: false })
    .range(0, 4);
  if (chatsError) throw chatsError;

  return {
    notes,
    projects,
    chats,
  };
}
