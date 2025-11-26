import { streamText, convertToModelMessages } from "ai";
import type { UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";

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

    const result = streamText({
      model: openai(CHAT_MODEL),
      messages: convertToModelMessages(messages),
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
