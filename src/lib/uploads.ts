"use client";

import { createClient } from "@/lib/supabase/client";

export interface IUploadResult {
  success: boolean;
  storage_path?: string;
  url?: string;
  error?: string;
}

export interface IUploadRecordData {
  auth_user_id: string;
  storage_path: string;
  url: string;
  filename: string;
  file_size: number;
  mime_type: string;
  note_id?: string;
}

export interface IUploadRecord extends IUploadRecordData {
  id: string;
  created_at: string;
}

export interface ICreateRecordResult {
  success: boolean;
  record?: IUploadRecord;
  error?: string;
}

export async function upload_file_to_storage(
  bucket: string,
  user_id: string,
  file: File
): Promise<IUploadResult> {
  try {
    const supabase = createClient();
    
    const file_ext = file.name.split(".").pop() || "";
    const timestamp = Date.now();
    const sanitized_name = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const file_name = `${timestamp}_${sanitized_name}`;
    const storage_path = `${user_id}/${file_name}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(storage_path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: url_data } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      success: true,
      storage_path: data.path,
      url: url_data.publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function create_upload_record(
  upload_data: IUploadRecordData
): Promise<ICreateRecordResult> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("user_uploads")
      .insert({
        auth_user_id: upload_data.auth_user_id,
        storage_path: upload_data.storage_path,
        url: upload_data.url,
        filename: upload_data.filename,
        file_size: upload_data.file_size,
        mime_type: upload_data.mime_type,
        note_id: upload_data.note_id,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      record: data as IUploadRecord,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function delete_upload_file(
  bucket: string,
  storage_path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase.storage.from(bucket).remove([storage_path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

