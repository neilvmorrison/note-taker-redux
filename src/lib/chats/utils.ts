import { ChatMessage } from "./chat-messages";
import { UIMessage } from "ai";

export function convertChatMessagesToUIMessages(
  chatMessages: ChatMessage[]
): UIMessage[] {
  return chatMessages
    .filter((msg) => msg.content)
    .map((msg) => ({
      id: msg.chat_context_id || msg.id,
      role: msg.role as "user" | "assistant",
      parts: [
        {
          type: "text" as const,
          text: msg.content || "",
        },
      ],
    }));
}

