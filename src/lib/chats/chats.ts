"use server";

import { getCurrentUser } from "../auth";
import { createClient } from "../supabase/server";
import { Database } from "../supabase/types/database";

export type InsertChatPayload =
  Database["public"]["Tables"]["chats"]["Insert"];
export type UpdateChatPayload =
  Database["public"]["Tables"]["chats"]["Update"];
export type Chat = Database["public"]["Tables"]["chats"]["Row"];

export async function createChat(payload: InsertChatPayload) {
  const current_user = await getCurrentUser();
  const sb = await createClient();

  try {
    if (!current_user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const { data: created_chat, error } = await sb
      .from("chats")
      .insert({ ...payload, user_profile_id: current_user.id })
      .select("*")
      .single();

    if (error) throw error;

    return {
      success: true,
      data: created_chat,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create chat",
    };
  }
}

export async function updateChat(payload: UpdateChatPayload) {
  if (!payload.id) {
    throw new Error("Chat ID is required for update operation");
  }

  const sb = await createClient();

  const { data: updated_chat, error } = await sb
    .from("chats")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", payload.id)
    .select("*")
    .single();

  if (error) throw error;
  return updated_chat;
}

export async function getChatById(id: string) {
  const sb = await createClient();

  const { data: found_chat, error } = await sb
    .from("chats")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) throw error;
  return found_chat;
}

export async function getChatsByUserId(user_id?: string) {
  const sb = await createClient();
  const current_user = await getCurrentUser();

  if (!current_user) {
    throw new Error("User Not Found");
  }

  const target_user_id = user_id || current_user.id;

  const { data: chats, error } = await sb
    .from("chats")
    .select("*")
    .eq("user_profile_id", target_user_id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return chats;
}

