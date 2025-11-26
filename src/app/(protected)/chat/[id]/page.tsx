"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { getChatMessagesByChatId, ChatMessage } from "@/lib/chats";
import UserMessage from "@/components/messages/user-message";
import AssistantMessage from "@/components/messages/assistant-message";

export default function ChatDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      if (!id || typeof id !== "string") {
        setError("Invalid chat ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const chatMessages = await getChatMessagesByChatId(id);
        setMessages(chatMessages || []);
      } catch (err) {
        console.error("Failed to load chat messages:", err);
        setError("Failed to load chat messages");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMessages();
  }, [id]);

  const firstUserMessage = messages.find((msg) => msg.role === "user");

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <PageHeader
        title={firstUserMessage?.content?.slice(0, 50) || "Chat"}
        description="Chat conversation"
        right_section={
          <Button onClick={() => router.push("/chat")}>New Chat</Button>
        }
      />
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        ) : error ? (
          <Alert variant="destructive">{error}</Alert>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No messages yet
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => {
              if (message.role === "user") {
                return (
                  <UserMessage
                    key={message.id}
                    content={message.content || ""}
                    created_at={message.created_at || ""}
                  />
                );
              } else {
                return (
                  <AssistantMessage
                    key={message.id}
                    content={message.content || ""}
                    created_at={message.created_at || ""}
                  />
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}
