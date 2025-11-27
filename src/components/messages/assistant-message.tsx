"use client";

import { memo, useEffect, useRef } from "react";
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
}

const lowlight = createLowlight(all);

function AssistantMessage({
  content,
  created_at,
  isStreaming,
}: AssistantMessageProps) {
  const lastContentRef = useRef<string>("");

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

  return (
    <div className="flex justify-start mb-4">
      <div
        className={cn(
          "rounded-2xl px-4 py-2",
          "bg-muted text-foreground",
          "rounded-bl-sm",
          "assistant-message-content",
          "w-full"
        )}
      >
        <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
          <EditorContent editor={editor} />
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-foreground animate-pulse" />
          )}
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
        </div>
      </div>
    </div>
  );
}

export default memo(AssistantMessage);
