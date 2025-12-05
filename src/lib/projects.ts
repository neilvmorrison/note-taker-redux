"use server";

import { getCurrentUser } from "./auth";
import { createClient } from "./supabase/server";
import { Database } from "./supabase/types/database";

export type InsertProjectPayload =
  Database["public"]["Tables"]["projects"]["Insert"];
export type UpdateProjectPayload =
  Database["public"]["Tables"]["projects"]["Update"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectsSearchParams = {
  name?: string;
  slug?: string;
  ownerId?: string;
  limit?: number;
  offset?: number;
};

export async function createProject(payload: InsertProjectPayload) {
  const sb = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("User Not Found");
  const { data: created_project, error } = await sb
    .from("projects")
    .insert({ ...payload, owner_id: currentUser.id })
    .select("*")
    .single();

  if (error) throw error;
  return {
    success: true,
    data: created_project,
  };
}

export async function updateProject(payload: UpdateProjectPayload) {
  const sb = await createClient();

  const { data: updated_project, error } = await sb
    .from("projects")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .select("*")
    .single();

  if (error) throw error;
  return updated_project;
}

export async function getProjectById(id: string) {
  const sb = await createClient();

  const { data: found_project, error } = await sb
    .from("projects")
    .select("*")
    .eq("id", id)
    .order("last_viewed_at", { ascending: false })
    .single();

  if (error) throw error;
  if (found_project) {
    await sb
      .from("projects")
      .update({ last_viewed_at: new Date().toISOString() })
      .eq("id", found_project.id);
  }
  return found_project;
}

export async function getProjectBySlug(slug: string) {
  const sb = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("User Not Found");
  const { data: found_project, error } = await sb
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("owner_id", currentUser?.id)
    .order("last_viewed_at", { ascending: false })
    .is("deleted_at", null)
    .single();

  if (error) throw error;
  if (found_project) {
    await sb
      .from("projects")
      .update({ last_viewed_at: new Date().toISOString() })
      .eq("id", found_project.id);
  }
  return found_project;
}

export async function getAllProjects({
  limit = 50,
  offset = 0,
  name,
}: { limit?: number; offset?: number; ownerId?: string; name?: string } = {}) {
  const sb = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("User Not Found");
  let query = sb
    .from("projects")
    .select("*")
    .order("last_viewed_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (name) {
    query = query.ilike("name", `%${name}%`);
  }

  query = query.eq("owner_id", currentUser.id);

  // Don't fetch deleted projects
  query = query.is("deleted_at", null);

  const { data: projects, error } = await query;

  if (error) throw error;
  return projects;
}

export async function searchProjects({
  name,
  slug,
  limit = 50,
  offset = 0,
}: ProjectsSearchParams = {}) {
  const sb = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("User Not Found");
  let query = sb
    .from("projects")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (name) {
    query = query.ilike("name", `%${name}%`);
  }

  if (slug) {
    query = query.eq("slug", slug);
  }

  query = query.eq("owner_id", currentUser.id);

  const { data: projects, error } = await query;

  if (error) throw error;
  return projects;
}
