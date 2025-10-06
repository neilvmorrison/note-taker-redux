"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";

import EditorToolbar from "./editor-toolbar";
import MobileEditorToolbar from "./mobile-editor-toolbar";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

export interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  autofocus?: boolean;
  editable?: boolean;
  placeholder?: string;
  className?: string;
}

export function TiptapEditor({
  content,
  onChange,
  onBlur,
  autofocus = false,
  editable = true,
  placeholder = "Write something...",
  className,
}: TiptapEditorProps) {
  const { isMobile } = useMobile();
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor(
    {
      extensions: [
        Document,
        Paragraph,
        Text,
        Heading.configure({
          levels: [1, 2, 3],
        }),
        BulletList,
        OrderedList,
        ListItem,
        Link.configure({
          openOnClick: false,
        }),
        Bold,
        Italic,
        Underline,
        Strike,
        Code,
        CodeBlock,
        StarterKit.configure({
          document: false,
          paragraph: false,
          text: false,
          heading: false,
          bulletList: false,
          orderedList: false,
          listItem: false,
          bold: false,
          italic: false,
          strike: false,
          code: false,
          codeBlock: false,
        }),
        Placeholder.configure({
          placeholder,
        }),
        Image.configure({
          HTMLAttributes: {
            class: "max-w-full h-auto rounded-md",
          },
        }),
      ],
      content,
      autofocus,
      editable,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      onBlur: () => {
        setIsFocused(false);
        if (onBlur) onBlur();
      },
      onFocus: () => {
        setIsFocused(true);
      },
      // Fix for SSR hydration mismatch
      immediatelyRender: false,
    },
    // Only initialize editor on client-side
    []
  );

  // Update content from props when it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // Use client-side rendering with useEffect to avoid hydration errors
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={cn("flex flex-col", className)}>
      {isMounted && editor && (
        <>
          {isMobile ? (
            <MobileEditorToolbar
              editor={editor}
              className={cn(
                "transition-opacity",
                isFocused ? "opacity-100" : "opacity-0"
              )}
            />
          ) : (
            <EditorToolbar editor={editor} />
          )}
          <EditorContent
            editor={editor}
            className={cn(
              "prose dark:prose-invert max-w-none w-full",
              "border rounded-md p-3 sm:p-5 min-h-[200px] focus-within:border-primary",
              "sm:text-base text-sm",
              "prose-headings:mb-2 prose-headings:mt-4 prose-p:my-2",
              "prose-img:my-4"
            )}
          />
        </>
      )}
      {!isMounted && (
        <div
          className={cn(
            "border rounded-md p-3 sm:p-5 min-h-[200px]",
            "flex items-center justify-center"
          )}
        >
          <span className="text-muted-foreground">Loading editor...</span>
        </div>
      )}
    </div>
  );
}

export default TiptapEditor;
