"use server";

import { getCurrentUser } from "../auth";
import { createClient } from "../supabase/server";
import { Database } from "../supabase/types/database";

export type InsertChatPayload = Database["public"]["Tables"]["chats"]["Insert"];
export type UpdateChatPayload = Database["public"]["Tables"]["chats"]["Update"];
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
  if (found_chat) {
    await sb
      .from("chats")
      .update({ last_viewed_at: new Date().toISOString() })
      .eq("id", found_chat.id);
  }
  return found_chat;
}

export async function getChatsByUserId({
  user_id,
  limit = 50,
  offset = 0,
  title,
}: {
  user_id?: string;
  limit?: number;
  offset?: number;
  title?: string;
}) {
  const sb = await createClient();
  const current_user = await getCurrentUser();

  if (!current_user) {
    throw new Error("User Not Found");
  }

  const target_user_id = user_id || current_user.id;

  let query = sb
    .from("chats")
    .select("*")
    .eq("user_profile_id", target_user_id)
    .is("deleted_at", null)
    .order("last_viewed_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (title) {
    query = query.ilike("title", `%${title}%`);
  }

  const { data: chats, error } = await query;
  if (error) throw error;
  return chats;
}

export async function createChatWithMessage(prompt: string) {
  const current_user = await getCurrentUser();
  const sb = await createClient();

  try {
    if (!current_user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    if (!prompt || !prompt.trim()) {
      return {
        success: false,
        message: "Prompt is required",
      };
    }

    const title = prompt.trim().slice(0, 50) || "New Chat";

    const { data: created_chat, error: chat_error } = await sb
      .from("chats")
      .insert({ title, user_profile_id: current_user.id })
      .select("*")
      .single();

    if (chat_error) throw chat_error;

    if (!created_chat) {
      return {
        success: false,
        message: "Failed to create chat",
      };
    }

    const { data: created_message, error: message_error } = await sb
      .from("chat_messages")
      .insert({
        chat_id: created_chat.id,
        role: "user",
        content: prompt.trim(),
      })
      .select("*")
      .single();

    if (message_error) throw message_error;

    if (!created_message) {
      return {
        success: false,
        message: "Failed to create chat message",
      };
    }

    return {
      success: true,
      data: {
        chat_id: created_chat.id,
        message_id: created_message.id,
      },
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create chat with message",
    };
  }
}
