"use client";

import { memo } from "react";
import { format } from "date-fns";
import { parseISO } from "date-fns";
import { ChatMessage } from "@/lib/chats";
import { cn } from "@/lib/utils";

interface AssistantMessageProps {
  content: string;
  created_at: string;
}

function AssistantMessage({ content, created_at }: AssistantMessageProps) {
  const parseTimestamp = (timestamp: string): Date => {
    if (!timestamp) return new Date();
    if (timestamp.includes("T")) {
      return parseISO(timestamp);
    }
    try {
      const isoFormat = timestamp.replace(" ", "T");
      return parseISO(isoFormat);
    } catch {
      return new Date();
    }
  };

  const formattedTime = format(parseTimestamp(created_at), "h:mm a");

  return (
    <div className="flex justify-start mb-4">
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-2",
          "bg-muted text-foreground",
          "rounded-bl-sm"
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        <div className="flex justify-end mt-1">
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
        </div>
      </div>
    </div>
  );
}

export default memo(AssistantMessage);

