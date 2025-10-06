"use server";

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

  const { data: created_project, error } = await sb
    .from("projects")
    .insert(payload)
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
    .update(payload)
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
    .single();

  if (error) throw error;
  return found_project;
}

export async function getProjectBySlug(slug: string) {
  const sb = await createClient();

  const { data: found_project, error } = await sb
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error) throw error;
  return found_project;
}

export async function getAllProjects({
  limit = 50,
  offset = 0,
  ownerId,
}: { limit?: number; offset?: number; ownerId?: string } = {}) {
  const sb = await createClient();

  let query = sb
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (ownerId) {
    query = query.eq("owner_id", ownerId);
  }

  // Don't fetch deleted projects
  query = query.is("deleted_at", null);

  const { data: projects, error } = await query;

  if (error) throw error;
  return projects;
}

export async function searchProjects({
  name,
  slug,
  ownerId,
  limit = 50,
  offset = 0,
}: ProjectsSearchParams = {}) {
  const sb = await createClient();

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

  if (ownerId) {
    query = query.eq("owner_id", ownerId);
  }

  const { data: projects, error } = await query;

  if (error) throw error;
  return projects;
}
