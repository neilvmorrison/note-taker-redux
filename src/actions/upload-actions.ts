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
  file: File
): Promise<UploadResult> {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: auth_error } = await supabase.auth.getUser();
    
    if (auth_error || !user) {
      return { 
        path: "", 
        fullUrl: "", 
        success: false, 
        error: "User not authenticated" 
      };
    }
    
    const user_id = user.id;
    const file_ext = file.name.split(".").pop();
    const file_name = `${user_id}-${Date.now()}.${file_ext}`;
    const file_path = `${user_id}/${file_name}`;

    const { data, error } = await supabase.storage
      .from(buckets.user_avatars)
      .upload(file_path, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      return { path: "", fullUrl: "", success: false, error: error.message };
    }

    const { data: url_data } = await supabase.storage
      .from(buckets.user_avatars)
      .getPublicUrl(file_path);

    return {
      path: file_path,
      fullUrl: url_data.publicUrl,
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
