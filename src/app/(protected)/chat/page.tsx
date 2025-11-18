"use client";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Textarea } from "@/components/ui/textarea";

export default function Chats() {
  const { user } = useCurrentUser();
  return (
    <div>
      <PageHeader
        title="Chat"
        description="Chat with your AI assistant"
        right_section={<Button>New Chat</Button>}
      />
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col gap-4 items-center">
          <Text variant="h2">
            Hello, <span className="text-blue-500">{user?.first_name}</span>
          </Text>
          <Textarea
            placeholder="Type your request here..."
            className="w-[480px] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
