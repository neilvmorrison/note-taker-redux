"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Code,
  Image as ImageIcon,
  MoreHorizontal,
  Undo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "../ui/input";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Spinner } from "@/components/ui/spinner";

interface MobileEditorToolbarProps {
  editor: Editor;
  className?: string;
  onInteraction?: (active: boolean) => void;
  userId?: string;
  noteId?: string;
}

export default function MobileEditorToolbar({
  editor,
  className,
  onInteraction,
  userId,
  noteId,
}: MobileEditorToolbarProps) {
  const [linkUrl, setLinkUrl] = useState("");
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
        "flex items-center justify-between gap-1 p-1.5 mb-2 rounded-md bg-background sticky top-1 z-10 border shadow-sm",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => onInteraction && onInteraction(true)}
      onClick={() => onInteraction && onInteraction(true)}
    >
      {/* Primary toolbar - always visible */}
      <div className="flex overflow-x-auto scrollbar-hide gap-1 py-0.5">
        <Button
          variant={buttonVariant(editor.isActive("bold"))}
          size="icon"
          className="w-8 h-8"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant={buttonVariant(editor.isActive("italic"))}
          size="icon"
          className="w-8 h-8"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant={buttonVariant(editor.isActive("underline"))}
          size="icon"
          className="w-8 h-8"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Button
          variant={buttonVariant(editor.isActive("bulletList"))}
          size="icon"
          className="w-8 h-8"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant={buttonVariant(editor.isActive("orderedList"))}
          size="icon"
          className="w-8 h-8"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          variant={buttonVariant(editor.isActive("heading", { level: 1 }))}
          size="icon"
          className="w-8 h-8"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>
      </div>

      {/* More options in a sheet */}
      <Sheet onOpenChange={(open) => onInteraction && onInteraction(open)}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 flex-shrink-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[45vh]">
          <SheetHeader>
            <SheetTitle>Formatting</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-4 gap-4 mt-6">
            <Button
              variant={buttonVariant(editor.isActive("bold"))}
              onClick={() => editor.chain().focus().toggleBold().run()}
              className="flex flex-col gap-1 h-auto py-3"
            >
              <Bold className="h-5 w-5" />
              <span className="text-xs">Bold</span>
            </Button>

            <Button
              variant={buttonVariant(editor.isActive("italic"))}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className="flex flex-col gap-1 h-auto py-3"
            >
              <Italic className="h-5 w-5" />
              <span className="text-xs">Italic</span>
            </Button>

            <Button
              variant={buttonVariant(editor.isActive("underline"))}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className="flex flex-col gap-1 h-auto py-3"
            >
              <Underline className="h-5 w-5" />
              <span className="text-xs">Underline</span>
            </Button>

            <Button
              variant={buttonVariant(editor.isActive("code"))}
              onClick={() => editor.chain().focus().toggleCode().run()}
              className="flex flex-col gap-1 h-auto py-3"
            >
              <Code className="h-5 w-5" />
              <span className="text-xs">Code</span>
            </Button>

            <Button
              variant={buttonVariant(editor.isActive("bulletList"))}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className="flex flex-col gap-1 h-auto py-3"
            >
              <List className="h-5 w-5" />
              <span className="text-xs">Bullet List</span>
            </Button>

            <Button
              variant={buttonVariant(editor.isActive("orderedList"))}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className="flex flex-col gap-1 h-auto py-3"
            >
              <ListOrdered className="h-5 w-5" />
              <span className="text-xs">Numbered</span>
            </Button>

            <Button
              variant={buttonVariant(editor.isActive("heading", { level: 1 }))}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className="flex flex-col gap-1 h-auto py-3"
            >
              <Heading1 className="h-5 w-5" />
              <span className="text-xs">Heading</span>
            </Button>

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
              onClick={triggerImageUpload}
              className="flex flex-col gap-1 h-auto py-3"
              disabled={isUploading || !userId}
            >
              {isUploading ? (
                <Spinner className="h-5 w-5" />
              ) : (
                <ImageIcon className="h-5 w-5" />
              )}
              <span className="text-xs">Image</span>
            </Button>
          </div>

          <div className="mt-8">
            <p className="text-sm font-medium mb-2">Add Link</p>
            <div className="flex gap-2">
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
              <Button onClick={setLink} disabled={!linkUrl}>
                Add
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
