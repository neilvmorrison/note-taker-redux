"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { getChatMessagesByChatId } from "@/lib/chats";
import { convertChatMessagesToUIMessages } from "@/lib/chats/utils";
import {
  updateChatMessageByContextId,
  createChatMessage,
} from "@/lib/chats/chat-messages";
import UserMessage from "@/components/messages/user-message";
import AssistantMessage from "@/components/messages/assistant-message";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function ChatDetailPage() {
  const { id: chatId } = useParams();
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasAutoTriggered = useRef(false);

  const {
    messages: chatMessages,
    status,
    error: chatError,
    sendMessage,
    setMessages,
  } = useChat({
    id: chatId as string,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        chat_id: chatId as string,
      },
    }),
    onFinish: async (message) => {
      if (!chatId || typeof chatId !== "string") return;

      try {
        const assistantMessage = message.message;
        if (assistantMessage.role === "assistant" && assistantMessage.id) {
          const textPart = assistantMessage.parts?.find(
            (part: { type: string }) => part.type === "text"
          );
          const content = textPart?.type === "text" ? textPart.text : "";

          if (content) {
            const existingMessage = await updateChatMessageByContextId(
              assistantMessage.id,
              chatId,
              {
                chat_context_id: assistantMessage.id,
                content,
              }
            ).catch(() => null);

            if (!existingMessage) {
              await createChatMessage({
                chat_id: chatId,
                role: "assistant",
                content,
                chat_context_id: assistantMessage.id,
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to save assistant message:", err);
      }
    },
  });

  useEffect(() => {
    async function loadInitialMessages() {
      if (!chatId || typeof chatId !== "string") {
        setError("Invalid chat ID");
        setIsInitializing(false);
        return;
      }

      try {
        setIsInitializing(true);
        setError(null);
        const persistedMessages = await getChatMessagesByChatId(chatId);
        const uiMessages = convertChatMessagesToUIMessages(persistedMessages);
        setMessages(uiMessages);

        if (
          persistedMessages.length === 1 &&
          persistedMessages[0].role === "user" &&
          !hasAutoTriggered.current
        ) {
          hasAutoTriggered.current = true;
        }
      } catch (err) {
        console.error("Failed to load chat messages:", err);
        setError("Failed to load chat messages");
      } finally {
        setIsInitializing(false);
      }
    }

    loadInitialMessages();
  }, [chatId, setMessages]);

  useEffect(() => {
    if (
      !isInitializing &&
      hasAutoTriggered.current &&
      chatMessages.length === 1 &&
      chatMessages[0]?.role === "user" &&
      status === "ready"
    ) {
      hasAutoTriggered.current = false;
      const userMessage = chatMessages[0];
      if (userMessage) {
        sendMessage({
          role: "user",
          parts: userMessage.parts,
        });
      }
    }
  }, [isInitializing, chatMessages, status, sendMessage]);

  const firstUserMessage = chatMessages.find((msg) => msg.role === "user");
  const textPart = firstUserMessage?.parts?.find(
    (part): part is { type: "text"; text: string } => part.type === "text"
  );
  const userMessageText = textPart?.text || "";

  const displayError = error || chatError?.message || null;
  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <PageHeader
        title={userMessageText?.slice(0, 50) || "Chat"}
        description="Chat conversation"
        right_section={
          <Button onClick={() => router.push("/chat")}>New Chat</Button>
        }
      />
      <div className="flex-1 px-4 py-6">
        {isInitializing ? (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        ) : displayError ? (
          <Alert variant="destructive">{displayError}</Alert>
        ) : chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No messages yet
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {chatMessages.map((message) => {
              const msgTextPart = message.parts?.find(
                (
                  part
                ): part is {
                  type: "text";
                  text: string;
                  state?: "streaming" | "done";
                } => part.type === "text"
              );
              const content = msgTextPart?.text || "";
              const createdAt = new Date().toISOString();

              if (message.role === "user") {
                return (
                  <UserMessage
                    key={message.id}
                    content={content}
                    created_at={createdAt}
                  />
                );
              } else {
                const isStreaming =
                  msgTextPart?.state === "streaming" || isLoading;
                return (
                  <AssistantMessage
                    key={message.id}
                    content={content}
                    created_at={createdAt}
                    isStreaming={isStreaming}
                  />
                );
              }
            })}
            {isLoading &&
              chatMessages[chatMessages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start mb-4">
                  <div className="max-w-[70%] rounded-2xl px-4 py-2 bg-muted text-foreground rounded-bl-sm">
                    <Spinner />
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
