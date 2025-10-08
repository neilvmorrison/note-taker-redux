"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AvatarUpload } from "@/components/avatar-upload";
import { UserProfile, ProfileUpdate } from "@/lib/auth";
import { updateProfile } from "@/actions/profile-actions";
import { Spinner } from "@/components/ui/spinner";

interface ProfileFormProps {
  user: UserProfile;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [formState, setFormState] = useState<ProfileUpdate>({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    middle_name: user.middle_name || "",
    avatar_url: user.avatar_url || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (url: string) => {
    setFormState((prev) => ({
      ...prev,
      avatar_url: url,
    }));
    // We'll set a temporary success message since the avatar is uploaded directly
    setSuccessMessage("Avatar updated successfully");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await updateProfile(user.id, formState);

      if (result.success) {
        setSuccessMessage("Profile updated successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(result.error || "Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred while updating your profile");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center">
            <AvatarUpload
              userId={user.id}
              currentAvatarUrl={user.avatar_url}
              onAvatarChange={handleAvatarChange}
              size="lg"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formState.first_name}
                onChange={handleChange}
                placeholder="First Name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="middle_name">Middle Name (Optional)</Label>
              <Input
                id="middle_name"
                name="middle_name"
                value={formState.middle_name || ""}
                onChange={handleChange}
                placeholder="Middle Name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formState.last_name}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" /> Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
