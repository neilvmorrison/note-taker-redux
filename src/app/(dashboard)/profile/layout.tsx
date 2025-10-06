import { Text } from "@/components/ui/text";
import { getCurrentUser } from "@/lib/auth";
import { ReactNode } from "react";

interface IProfileLayoutProps {
  children: ReactNode;
}

export default async function ProfileLayout({ children }: IProfileLayoutProps) {
  const currentUser = await getCurrentUser();
  return (
    <div>
      <div className="mb-4">
        <Text>
          {currentUser?.first_name} {currentUser?.last_name}
        </Text>
        <Text dimmed>{currentUser?.email}</Text>
      </div>
      <div>{children}</div>
    </div>
  );
}
