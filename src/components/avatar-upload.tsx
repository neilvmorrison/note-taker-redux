"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { uploadAvatarFile } from "@/actions/upload-actions";
import { Spinner } from "@/components/ui/spinner";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string | null;
  onAvatarChange: (url: string) => void;
  size?: "sm" | "md" | "lg";
}

export function AvatarUpload({
  userId,
  currentAvatarUrl,
  onAvatarChange,
  size = "md",
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    currentAvatarUrl || null
  );
  const [error, setError] = useState<string | null>(null);

  const sizeClasses = {
    sm: "size-10",
    md: "size-16",
    lg: "size-24",
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadAvatarFile(userId, file);

      if (!result.success) {
        setError(result.error || "Failed to upload avatar");
      } else {
        setAvatarUrl(result.fullUrl);
        onAvatarChange(result.fullUrl);
      }
    } catch (err) {
      setError("Failed to upload avatar");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = () => {
    return userId.substring(0, 1).toUpperCase();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="Profile" />
          ) : (
            <AvatarFallback>{getInitials()}</AvatarFallback>
          )}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <Spinner size="sm" />
            </div>
          )}
        </Avatar>
      </div>

      <div>
        <input
          type="file"
          id="avatar-upload"
          className="sr-only"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <label htmlFor="avatar-upload">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer"
            disabled={isUploading}
            asChild
          >
            <span>{avatarUrl ? "Change Avatar" : "Upload Avatar"}</span>
          </Button>
        </label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
