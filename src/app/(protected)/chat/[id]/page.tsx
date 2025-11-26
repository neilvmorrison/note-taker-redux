"use client";
import { useParams } from "next/navigation";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function ChatDetailPage() {
  const { id } = useParams();
  return (
    <div>
      <PageHeader
        title={`Chat ${id}`}
        description="Summary of the chat, here you can see the history of the chat and the current conversation"
        right_section={<Button>New Chat</Button>}
      />
    </div>
  );
}
