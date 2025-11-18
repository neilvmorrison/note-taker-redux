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
import Highlight from "@tiptap/extension-highlight";

import EditorToolbar from "./editor-toolbar";
import MobileEditorToolbar from "./mobile-editor-toolbar";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import BubbleMenu from "./bubble-menu";

export interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  autofocus?: boolean;
  editable?: boolean;
  placeholder?: string;
  className?: string;
  userId?: string;
  noteId?: string;
}

export function TiptapEditor({
  content,
  onChange,
  onBlur,
  autofocus = false,
  editable = true,
  placeholder = "Write something...",
  className,
  userId,
  noteId,
}: TiptapEditorProps) {
  // Add custom CSS for ProseMirror editor to ensure full clickability
  useEffect(() => {
    // Add custom CSS for the ProseMirror editor with strong styling rules
    const style = document.createElement("style");
    style.innerHTML = `
      .ProseMirror {
        min-height: 100%;
        outline: none !important;
        width: 100%;
        height: 100%;
        display: block !important;
      }
      
      /* Force style reapplication when format is changed */
      .ProseMirror.format-changed * {
        display: inline-block;
      }
      .ProseMirror.format-changed * {
        display: initial;
      }
      
      /* Placeholder styling */
      .ProseMirror p.is-editor-empty:first-child::before {
        color: #adb5bd;
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
      }
      
      /* Headings with !important to ensure they display properly */
      .ProseMirror h1 {
        font-size: 2em !important;
        font-weight: bold !important;
        line-height: 1.2 !important;
        margin-top: 0.67em !important;
        margin-bottom: 0.67em !important;
      }
      
      .ProseMirror h2 {
        font-size: 1.5em !important;
        font-weight: bold !important;
        line-height: 1.3 !important;
        margin-top: 0.83em !important;
        margin-bottom: 0.83em !important;
      }
      
      .ProseMirror h3 {
        font-size: 1.17em !important;
        font-weight: bold !important;
        line-height: 1.4 !important;
        margin-top: 1em !important;
        margin-bottom: 1em !important;
      }
      
      /* Text formatting */
      .ProseMirror strong, .ProseMirror b {
        font-weight: bold !important;
      }
      
      .ProseMirror em, .ProseMirror i {
        font-style: italic !important;
      }
      
      .ProseMirror u {
        text-decoration: underline !important;
      }
      
      .ProseMirror s, .ProseMirror strike {
        text-decoration: line-through !important;
      }
      
      /* Code blocks */
      .ProseMirror code {
        font-family: monospace !important;
        background-color: rgba(97, 97, 97, 0.1) !important;
        border-radius: 3px !important;
        padding: 0.2em 0.4em !important;
      }
      
      .ProseMirror pre {
        background-color: #0D0D0D !important;
        color: white !important;
        padding: 0.75rem 1rem !important;
        border-radius: 0.5rem !important;
        font-family: monospace !important;
        margin: 1rem 0 !important;
      }
      
      .ProseMirror pre code {
        color: inherit !important;
        background: none !important;
        padding: 0 !important;
      }
      
      /* Lists */
      .ProseMirror ul {
        list-style-type: disc !important;
        padding-left: 1.5em !important;
        margin: 1em 0 !important;
      }
      
      .ProseMirror ol {
        list-style-type: decimal !important;
        padding-left: 1.5em !important;
        margin: 1em 0 !important;
      }
      
      .ProseMirror li {
        margin-bottom: 0.5em !important;
      }
      
      /* Links */
      .ProseMirror a {
        color: #0074de !important;
        text-decoration: underline !important;
      }
      
      /* Images */
      .ProseMirror img {
        max-width: 100% !important;
        height: auto !important;
        border-radius: 4px !important;
        margin: 1em 0 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const { isMobile } = useMobile();
  const [isFocused, setIsFocused] = useState(false);
  const [isToolbarActive, setIsToolbarActive] = useState(false);

  // Function to handle toolbar interaction
  const handleToolbarInteraction = (active: boolean) => {
    setIsToolbarActive(active);
  };

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
        Highlight.configure({
          multicolor: true,
        }),
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
        const html = editor.getHTML();
        if (html !== content) {
          onChange(html);
        }
      },
      onBlur: () => {
        setIsFocused(false);
        if (onBlur) onBlur();
      },
      onFocus: () => {
        setIsFocused(true);
      },
      immediatelyRender: false,
    },
    []
  );

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // Optimize format change handling to avoid jankiness
  useEffect(() => {
    if (!editor) return;

    // Add a transaction handler to ensure styles are applied immediately,
    // but only for transactions that involve formatting changes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateHandler = ({ transaction }: { transaction: any }) => {
      if (!transaction.docChanged) {
        return; // Skip DOM manipulation for selection-only changes
      }

      // Use RAF for smoother rendering
      requestAnimationFrame(() => {
        const editorElement = document.querySelector(".ProseMirror");
        if (editorElement) {
          // We're now more selective about when to force style refresh
          if (transaction.getMeta("formatting")) {
            editorElement.classList.add("format-changed");
            requestAnimationFrame(() => {
              editorElement.classList.remove("format-changed");
            });
          }
        }
      });
    };

    editor.on("transaction", updateHandler);

    return () => {
      editor.off("transaction", updateHandler);
    };
  }, [editor]);

  // Use client-side rendering with useEffect to avoid hydration errors
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={cn("flex flex-col relative", className)}>
      {isMounted && editor && (
        <>
          <div
            className={cn(
              "sticky top-0 z-10",
              !isFocused && !isToolbarActive && "hidden"
            )}
          >
            {/* <BubbleMenu editor={editor} /> */}
            {isMobile ? (
              <MobileEditorToolbar
                editor={editor}
                className={cn("transition-opacity", "opacity-100")}
                onInteraction={handleToolbarInteraction}
                userId={userId}
                noteId={noteId}
              />
            ) : (
              <EditorToolbar
                editor={editor}
                className={cn("transition-opacity duration-200", "opacity-100")}
                onInteraction={handleToolbarInteraction}
                userId={userId}
                noteId={noteId}
              />
            )}
          </div>
          <EditorContent
            editor={editor}
            className={cn(
              "prose dark:prose-invert max-w-none w-full",
              "rounded-md p-3 sm:p-5 min-h-[200px]",
              // Use a consistent border to prevent layout shifts, just change color
              isFocused ? "border-primary" : "border-muted",
              "transition-colors duration-200 ease-in-out",
              "sm:text-base text-sm",
              "cursor-text outline-none",
              "editor-container" // Added custom class for styling
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
