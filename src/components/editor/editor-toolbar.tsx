"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Image as ImageIcon,
  Link,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useRef } from "react";
import { Input } from "../ui/input";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Spinner } from "@/components/ui/spinner";

interface EditorToolbarProps {
  editor: Editor;
  className?: string;
  onInteraction?: (active: boolean) => void;
  userId?: string;
  noteId?: string;
}

export default function EditorToolbar({
  editor,
  className,
  onInteraction,
  userId,
  noteId,
}: EditorToolbarProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading, error: uploadError } = useFileUpload();

  // Create a wrapper function for handling mouse events
  const handleMouseEnter = () => {
    if (onInteraction) {
      onInteraction(true);
    }
  };

  const handleMouseLeave = () => {
    if (onInteraction) {
      onInteraction(false);
    }
  };

  // Toggle button classes based on active state
  const buttonVariant = (active: boolean) => (active ? "default" : "outline");

  // Handle setting a link
  const setLink = () => {
    if (!linkUrl) return;

    // Check if link starts with http/https, add https if not
    const url = linkUrl.match(/^https?:\/\//) ? linkUrl : `https://${linkUrl}`;

    editor.chain().focus().setLink({ href: url }).run();
    setLinkUrl("");
    setShowLinkInput(false);
  };

  // Handle adding an image from file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    try {
      const result = await uploadFile(file, userId, noteId);
      if (result.success && result.url) {
        editor.chain().focus().setImage({ src: result.url }).run();
      }
    } catch (err) {
      console.error("Failed to upload image:", err);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "flex flex-wrap gap-1 p-1 mb-2 border rounded-md bg-background shadow-sm",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => onInteraction && onInteraction(true)}
      onClick={() => onInteraction && onInteraction(true)}
    >
      <div className="flex flex-wrap gap-1">
        {/* Text formatting */}
        <Button
          variant={buttonVariant(editor.isActive("bold"))}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant={buttonVariant(editor.isActive("italic"))}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant={buttonVariant(editor.isActive("underline"))}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Button
          variant={buttonVariant(editor.isActive("strike"))}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-8" />

        {/* Headings */}
        <Button
          variant={buttonVariant(editor.isActive("heading", { level: 1 }))}
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          variant={buttonVariant(editor.isActive("heading", { level: 2 }))}
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          variant={buttonVariant(editor.isActive("heading", { level: 3 }))}
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-8" />

        {/* Lists */}
        <Button
          variant={buttonVariant(editor.isActive("bulletList"))}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant={buttonVariant(editor.isActive("orderedList"))}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-8" />

        {/* Code */}
        <Button
          variant={buttonVariant(editor.isActive("code"))}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-8" />

        {/* Link */}
        {showLinkInput ? (
          <div className="flex">
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="h-9 w-40 text-xs"
              onKeyDown={(e) => e.key === "Enter" && setLink()}
            />
            <Button
              size="sm"
              onClick={setLink}
              disabled={!linkUrl}
              variant="default"
            >
              Set
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl("");
              }}
              variant="ghost"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant={buttonVariant(editor.isActive("link"))}
            size="sm"
            onClick={() => {
              const previousUrl = editor.getAttributes("link").href;
              if (previousUrl) {
                editor.chain().focus().unsetLink().run();
              } else {
                setShowLinkInput(true);
              }
            }}
            title="Link"
          >
            <Link className="h-4 w-4" />
          </Button>
        )}

        {/* Image */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleImageUpload}
          disabled={isUploading || !userId}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={triggerImageUpload}
          title={userId ? "Upload Image" : "Login required to upload images"}
          disabled={isUploading || !userId}
        >
          {isUploading ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </Button>

        <Separator orientation="vertical" className="h-8" />

        {/* Undo/Redo */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
