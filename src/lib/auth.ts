"use server";
import { createClient } from "./supabase/server";
import { Database } from "./supabase/types/database";

export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];

export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    first_name?: string;
    last_name?: string;
  };
}

export interface ProfileUpdate {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  avatar_url?: string;
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  if (user) {
    const { data: user_profile, error: up_error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    if (!user_profile || up_error) {
      return null;
    }
    return user_profile;
  }
  return null;
}

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as UserProfile;
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  return !error && !!data;
}

export async function updateUserProfile(
  userId: string,
  updates: ProfileUpdate
): Promise<UserProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error || !data) {
    return null;
  }

  return data as UserProfile;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
