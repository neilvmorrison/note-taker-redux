"use server";

import { getCurrentUser } from "./auth";
import { createClient } from "./supabase/server";
import { Database } from "./supabase/types/database";

export type InsertNotePayload = Database["public"]["Tables"]["notes"]["Insert"];
export type UpdateNotePayload = Database["public"]["Tables"]["notes"]["Update"];
export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type NotesSearchParams = {
  title?: string;
  authorId?: string;
  limit?: number;
  offset?: number;
};

export async function createNote(payload: InsertNotePayload) {
  const currentUser = await getCurrentUser();
  const sb = await createClient();

  try {
    const { data: created_note, error } = await sb
      .from("notes")
      .insert({ ...payload, author_id: currentUser?.id })
      .select("*")
      .single();

    if (error) throw error;

    return {
      success: true,
      data: created_note,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create note",
    };
  }
}

export async function updateNote(payload: UpdateNotePayload) {
  if (!payload.id) {
    throw new Error("Note ID is required for update operation");
  }

  const sb = await createClient();

  const { data: updated_note, error } = await sb
    .from("notes")
    .update(payload)
    .eq("id", payload.id) // Add WHERE clause to specify which note to update
    .select("*")
    .single();

  if (error) throw error;
  return updated_note;
}

export async function getNoteById(id: string) {
  const sb = await createClient();

  const { data: found_note, error } = await sb
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return found_note;
}

export async function getAllNotes({
  limit = 50,
  offset = 0,
  authorId,
}: { limit?: number; offset?: number; authorId?: string } = {}) {
  const sb = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("User Not Found");
  let query = sb
    .from("notes")
    .select("*")
    .eq("author_id", currentUser?.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (authorId) {
    query = query.eq("author_id", authorId);
  }

  // Don't fetch deleted notes
  query = query.is("deleted_at", null);

  const { data: notes, error } = await query;

  if (error) throw error;
  return notes;
}

export async function searchNotes({
  title,
  authorId,
  limit = 50,
  offset = 0,
}: NotesSearchParams = {}) {
  const sb = await createClient();

  let query = sb
    .from("notes")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (title) {
    query = query.ilike("title", `%${title}%`);
  }

  if (authorId) {
    query = query.eq("author_id", authorId);
  }

  const { data: notes, error } = await query;

  if (error) throw error;
  return notes;
}
