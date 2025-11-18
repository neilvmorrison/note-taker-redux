import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  return (
    <div>
      <PageHeader
        title="Chat Title"
        description="Summary of the chat, here you can see the history of the chat and the current conversation"
        right_section={<Button>New Chat</Button>}
      />
    </div>
  );
}
