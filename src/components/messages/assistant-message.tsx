"use client";

import { memo, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { parseISO } from "date-fns";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from "@tiptap/extension-table";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import { Mathematics } from "@tiptap/extension-mathematics";
import { all, createLowlight } from "lowlight";

import { cn } from "@/lib/utils";
import "highlight.js/styles/github.css";
import "katex/dist/katex.min.css";
import highlightjs from "highlight.js";
import "./editor.css";

interface AssistantMessageProps {
  content: string;
  created_at: string;
  isStreaming?: boolean;
  model: string | null;
}

const lowlight = createLowlight(all);

function AssistantMessage({
  content,
  created_at,
  model,
}: AssistantMessageProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const lastContentRef = useRef<string>("");
  const contentContainerRef = useRef<HTMLDivElement>(null);

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

  const getFirstLine = (text: string): string => {
    if (!text) return "";
    const plainText = text.replace(/[#*`_~\[\]()]/g, "").trim();
    const lines = plainText
      .split("\n")
      .filter((line) => line.trim().length > 0);
    const firstLine = lines[0] || "";
    return firstLine.length > 100 ? firstLine.slice(0, 100) + "..." : firstLine;
  };

  const firstLine = getFirstLine(content);
  const hasMultipleLines =
    content.split("\n").filter((line) => line.trim().length > 0).length > 1;

  const preprocessMathContent = (text: string): string => {
    if (!text) return text;
    return text
      .replace(/\\\[([\s\S]*?)\\\]/g, (_, latex) => `$$${latex}$$`)
      .replace(/\\\(([\s\S]*?)\\\)/g, (_, latex) => `$${latex}$`);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Markdown,
      Mathematics,
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    onUpdate: ({ editor }) => {
      if (editor.getText().length > 0) {
        highlightjs.highlightAll();
      }
    },
    content: content || "",
    editable: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content && content !== lastContentRef.current) {
      try {
        lastContentRef.current = content;
        const processedContent = preprocessMathContent(content);
        editor.commands.setContent(processedContent, {
          contentType: "markdown",
        });
      } catch (error) {
        console.error("Error setting markdown content:", error);
      }
    }
  }, [editor, content]);

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  if (!hasMultipleLines && !content.trim()) {
    return (
      <div className="flex justify-start mb-4">
        <div
          className={cn(
            "rounded-2xl px-6 py-6",
            "bg-muted text-foreground",
            "rounded-bl-sm",
            "assistant-message-content",
            "w-full"
          )}
        >
          <div className="text-sm text-muted-foreground">
            Assistant Response
          </div>
          <div className="flex justify-end mt-1 gap-2 items-center text-xs text-muted-foreground">
            {model && (
              <>
                <span>{model}</span>
                <span>•</span>
              </>
            )}
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div
        className={cn(
          "rounded-2xl px-6 py-6",
          "bg-muted text-foreground",
          "rounded-bl-sm",
          "assistant-message-content",
          "w-full",
          hasMultipleLines && "cursor-pointer"
        )}
        onClick={() => hasMultipleLines && setIsCollapsed(!isCollapsed)}
      >
        <div className="relative">
          {isCollapsed && hasMultipleLines ? (
            <div className="text-sm text-muted-foreground transition-opacity duration-300">
              {firstLine || "Assistant Response"}
            </div>
          ) : (
            <div
              ref={contentContainerRef}
              className={cn(
                "text-sm prose prose-sm dark:prose-invert max-w-none",
                "transition-all duration-300 ease-in-out",
                "animate-in fade-in slide-in-from-top-1"
              )}
            >
              <EditorContent editor={editor} />
            </div>
          )}
        </div>
        <div className="flex justify-end mt-1 gap-2 items-center text-xs text-muted-foreground">
          {model && (
            <>
              <span>{model}</span>
              <span>•</span>
            </>
          )}
          <span>{formattedTime}</span>
        </div>
      </div>
    </div>
  );
}

export default memo(AssistantMessage);
