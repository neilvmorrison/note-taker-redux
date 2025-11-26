"use server";

import { createClient } from "../supabase/server";
import { Database } from "../supabase/types/database";

export type InsertChatMessagePayload =
  Database["public"]["Tables"]["chat_messages"]["Insert"];
export type UpdateChatMessagePayload =
  Database["public"]["Tables"]["chat_messages"]["Update"];
export type ChatMessage = Database["public"]["Tables"]["chat_messages"]["Row"];

export async function createChatMessage(payload: InsertChatMessagePayload) {
  const sb = await createClient();

  try {
    if (!payload.chat_id) {
      return {
        success: false,
        message: "Chat ID is required",
      };
    }

    const { data: created_message, error } = await sb
      .from("chat_messages")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;

    return {
      success: true,
      data: created_message,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create chat message",
    };
  }
}

export async function updateChatMessage(payload: UpdateChatMessagePayload) {
  if (!payload.id) {
    throw new Error("Chat message ID is required for update operation");
  }

  const sb = await createClient();

  const { data: updated_message, error } = await sb
    .from("chat_messages")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", payload.id)
    .select("*")
    .single();

  if (error) throw error;
  return updated_message;
}

export async function getChatMessagesByChatId(chat_id: string) {
  const sb = await createClient();

  const { data: messages, error } = await sb
    .from("chat_messages")
    .select("*")
    .eq("chat_id", chat_id)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return messages;
}

export async function updateChatMessageByContextId(
  chat_context_id: string,
  chat_id: string,
  payload: Partial<UpdateChatMessagePayload>
) {
  const sb = await createClient();

  const { data: updated_message, error } = await sb
    .from("chat_messages")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("chat_context_id", chat_context_id)
    .eq("chat_id", chat_id)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return updated_message;
}
