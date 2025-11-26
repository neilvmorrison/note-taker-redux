import { streamText, convertToModelMessages } from "ai";
import type { UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { createChatMessage } from "@/lib/chats/chat-messages";

const CHAT_MODEL = process.env.CHAT_MODEL || "gpt-4o-mini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, chat_id, id } = body as {
      messages?: UIMessage[];
      chat_id?: string;
      id?: string;
    };

    const chatId = chat_id || id;

    if (!chatId) {
      console.error("Missing chat_id/id in request body:", body);
      return new Response(
        JSON.stringify({ error: "chat_id or id is required", received: body }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const lastMessage = messages[messages.length - 1];
    const assistantContextId =
      lastMessage?.role === "assistant" ? lastMessage.id : undefined;

    const result = streamText({
      model: openai(CHAT_MODEL),
      messages: convertToModelMessages(messages),
      onFinish: async ({ text }) => {
        try {
          const assistantMessageId =
            assistantContextId || `assistant-${Date.now()}`;

          console.log("Streaming finished, saving assistant message:", {
            chat_id: chatId,
            chat_context_id: assistantMessageId,
            textLength: text.length,
          });

          const result = await createChatMessage({
            chat_id: chatId,
            role: "assistant",
            content: text,
            chat_context_id: assistantMessageId,
          });

          if (result.success) {
            console.log(
              "Assistant message saved successfully:",
              result.data?.id,
              "chat_context_id:",
              result.data?.chat_context_id
            );
          } else {
            console.error("Failed to save assistant message:", result.message);
          }
        } catch (error) {
          console.error("Error saving assistant message:", error);
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      error instanceof Error ? error.message : "Internal server error",
      { status: 500 }
    );
  }
}
