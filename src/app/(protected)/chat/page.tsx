import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function Chats() {
  return (
    <div>
      <PageHeader
        title="Chat"
        description="Chat with your AI assistant"
        right_section={<Button>New Chat</Button>}
      />
    </div>
  );
}
