"use server";

import { createClient } from "@/lib/supabase/server";
import { buckets } from "@/constants/buckets";

export type UploadResult = {
  path: string;
  fullUrl: string;
  success: boolean;
  error?: string;
};

export async function uploadAvatarFile(
  userId: string,
  file: File
): Promise<UploadResult> {
  try {
    const supabase = await createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(buckets.user_avatars)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      return { path: "", fullUrl: "", success: false, error: error.message };
    }

    const { data: urlData } = await supabase.storage
      .from(buckets.user_avatars)
      .getPublicUrl(filePath);

    return {
      path: filePath,
      fullUrl: urlData.publicUrl,
      success: true,
    };
  } catch (error) {
    return {
      path: "",
      fullUrl: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
