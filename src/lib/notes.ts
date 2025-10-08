"use server";

import { note_event_types } from "@/constants";
import { getCurrentUser } from "./auth";
import { createClient } from "./supabase/server";
import { Database } from "./supabase/types/database";

export type InsertNotePayload = Database["public"]["Tables"]["notes"]["Insert"];
export type UpdateNotePayload = Database["public"]["Tables"]["notes"]["Update"];
export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type NoteAction = Database["public"]["Tables"]["note_actions"]["Row"] & {
  actor?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  } | null;
};
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

    if (created_note) {
      await sb.from("note_actions").insert({
        previous_state: null,
        updated_state: null,
        event_type: note_event_types.created,
        note_id: created_note.id,
        actor_id: currentUser?.id,
      });
    }

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
    .update({ ...payload, updated_at: new Date().toISOString() })
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

  if (found_note) {
    const { data: project_data, error: project_error } = await sb
      .from("project_notes")
      .select("*")
      .eq("note_id", found_note.id)
      .maybeSingle();
    if (project_error) throw project_error;
    return {
      ...found_note,
      project_id: project_data?.project_id ?? null,
    };
  }
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

export async function getAllProjectNotes(project_slug: string) {
  const sb = await createClient();

  // First get the project ID from the slug
  const { data: project, error: projectError } = await sb
    .from("projects")
    .select("id")
    .eq("slug", project_slug)
    .is("deleted_at", null)
    .single();

  if (projectError) throw projectError;
  if (!project)
    throw new Error(`Project with slug '${project_slug}' not found`);

  // Then get all notes linked to this project
  const { data: projectNotes, error } = await sb
    .from("project_notes")
    .select(
      `
      id,
      note_id,
      project_id,
      notes:note_id(
        id,
        title,
        content,
        created_at,
        updated_at,
        author_id
      )
    `
    )
    .eq("project_id", project.id)
    .is("deleted_at", null);

  if (error) throw error;

  // Transform the data to match the expected format
  const notes = projectNotes?.map((item) => item.notes) || [];

  return notes;
}

export async function addNoteToProject(
  noteId: string,
  projectIdOrSlug: string
) {
  const sb = await createClient();
  let projectId = projectIdOrSlug;

  // If a slug was provided, get the project ID first
  if (
    !projectIdOrSlug.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    )
  ) {
    const { data: project, error: projectError } = await sb
      .from("projects")
      .select("id")
      .eq("slug", projectIdOrSlug)
      .is("deleted_at", null)
      .single();

    if (projectError) throw projectError;
    if (!project)
      throw new Error(`Project with slug '${projectIdOrSlug}' not found`);

    projectId = project.id;
  }

  // Check if the note already exists in the project to avoid duplicates
  const { data: existingLink, error: checkError } = await sb
    .from("project_notes")
    .select("id")
    .eq("note_id", noteId)
    .eq("project_id", projectId)
    .is("deleted_at", null)
    .maybeSingle();

  if (checkError) throw checkError;

  // If the link already exists, return early
  if (existingLink) {
    return {
      success: true,
      data: existingLink,
    };
  }

  // Create the project-note link
  const { data: projectNote, error } = await sb
    .from("project_notes")
    .insert({
      note_id: noteId,
      project_id: projectId,
    })
    .select("*")
    .single();

  if (error) throw error;

  return {
    success: true,
    data: projectNote,
  };
}

export async function createNoteInProject(
  payload: InsertNotePayload,
  projectSlug: string
) {
  // First create the note
  const noteResult = await createNote(payload);

  if (!noteResult.success || !noteResult.data) {
    return noteResult;
  }

  // Then link it to the project
  try {
    await addNoteToProject(noteResult.data.id, projectSlug);
    return noteResult;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to add note to project",
      data: noteResult.data, // Return the note data anyway, since it was created successfully
    };
  }
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

export async function getNoteActions(noteId: string) {
  const sb = await createClient();

  const { data: actions, error } = await sb
    .from("note_actions")
    .select(
      `
      *,
      actor:actor_id(
        id,
        first_name,
        last_name,
        email
      )
    `
    )
    .eq("note_id", noteId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return actions as NoteAction[];
}
