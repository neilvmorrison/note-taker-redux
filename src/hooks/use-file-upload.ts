"use client";

import { useState } from "react";
import {
  upload_file_to_storage,
  create_upload_record,
  IUploadRecordData,
} from "@/lib/uploads";
import { buckets } from "@/constants/buckets";

export interface IFileUploadResult {
  success: boolean;
  url?: string;
  recordId?: string;
  error?: string;
}

export interface IUseFileUpload {
  isUploading: boolean;
  error: string | null;
  progress: number;
  uploadFile: (
    file: File,
    userId: string,
    noteId?: string
  ) => Promise<IFileUploadResult>;
  clearError: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

export function useFileUpload(): IUseFileUpload {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Only image files are allowed (JPEG, PNG, GIF, WebP, SVG)";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB";
    }

    return null;
  };

  const uploadFile = async (
    file: File,
    userId: string,
    noteId?: string
  ): Promise<IFileUploadResult> => {
    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return { success: false, error: validationError };
      }

      setProgress(25);

      const uploadResult = await upload_file_to_storage(
        buckets.user_uploads,
        userId,
        file
      );

      if (!uploadResult.success || !uploadResult.storage_path || !uploadResult.url) {
        const errorMsg = uploadResult.error || "Failed to upload file";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      setProgress(60);

      const recordData: IUploadRecordData = {
        auth_user_id: userId,
        storage_path: uploadResult.storage_path,
        url: uploadResult.url,
        filename: file.name,
        file_size: file.size,
        mime_type: file.type,
        note_id: noteId,
      };

      const recordResult = await create_upload_record(recordData);

      if (!recordResult.success || !recordResult.record) {
        const errorMsg = recordResult.error || "Failed to create upload record";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      setProgress(100);

      return {
        success: true,
        url: uploadResult.url,
        recordId: recordResult.record.id,
      };
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const clearError = () => setError(null);

  return {
    isUploading,
    error,
    progress,
    uploadFile,
    clearError,
  };
}

