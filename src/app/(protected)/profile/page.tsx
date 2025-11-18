import { ProfileForm } from "@/components/profile-form";
import PageHeader from "@/components/page-header";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/authentication");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Update your personal information and profile picture"
      />
      <ProfileForm user={user} />
    </div>
  );
}
