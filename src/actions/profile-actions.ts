"use server";

import { createClient } from "@/lib/supabase/server";
import { ProfileUpdate } from "@/lib/auth";

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
