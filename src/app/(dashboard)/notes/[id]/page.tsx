"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getNoteById, updateNote } from "@/lib/notes";
import TiptapEditor from "@/components/editor/tiptap-editor";
import { useAutoSave } from "@/hooks/use-auto-save";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Save, ArrowLeft } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export default function NoteDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<{
    id: string;
    title: string;
    content: string;
  } | null>(null);

  // Fetch note data
  useEffect(() => {
    const fetchNote = async () => {
      if (typeof id !== "string") {
        setError("Invalid note ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const noteData = await getNoteById(id);
        setNote({
          id: noteData.id,
          title: noteData.title || "Untitled Note",
          content: noteData.content ? String(noteData.content) : "",
        });
      } catch (err) {
        setError("Failed to load note.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  // Update note handler
  const handleUpdateNote = async (updatedNote: typeof note) => {
    if (!updatedNote) return;

    try {
      await updateNote({
        id: updatedNote.id,
        title: updatedNote.title,
        content: updatedNote.content,
      });
    } catch (err) {
      console.error("Failed to save note:", err);
      throw err;
    }
  };

  // Setup auto-save for the note
  const {
    isSaving,
    error: saveError,
    forceSave,
    hasPendingChanges,
  } = useAutoSave({
    data: note,
    onSave: handleUpdateNote,
    debounce: 5000, // 5 seconds after last change
  });

  // Handle title change
  const handleTitleChange = (newTitle: string) => {
    if (note) {
      setNote({ ...note, title: newTitle });
    }
  };

  // Handle content change
  const handleContentChange = (newContent: string) => {
    if (note) {
      setNote({ ...note, content: newContent });
    }
  };

  // Handle back button
  const handleBack = async () => {
    if (hasPendingChanges) {
      await forceSave();
    }
    router.push("/notes");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div>
          <Spinner size="xs" />
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <Alert variant="destructive">{error || "Unable to load note."}</Alert>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between sticky top-0 bg-background z-10 py-2">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Input
            value={note.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-xl font-semibold h-auto py-1 max-w-sm"
            placeholder="Untitled Note"
          />
        </div>
        <div className="flex items-center gap-2">
          {(isSaving || hasPendingChanges) && (
            <span
              className={cn(
                "text-xs",
                isSaving ? "text-muted-foreground" : "text-amber-500"
              )}
            >
              {isSaving ? "Saving..." : "Unsaved changes"}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            disabled={isSaving || !hasPendingChanges}
            onClick={forceSave}
          >
            {isSaving ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            Save
          </Button>
        </div>
      </div>

      {saveError && (
        <Alert variant="destructive" className="my-2">
          Failed to save note. Please try again.
        </Alert>
      )}

      <Card className="flex-grow">
        <CardContent className="pt-6">
          <TiptapEditor
            content={note.content}
            onChange={handleContentChange}
            placeholder="Start writing your note..."
            className="min-h-[calc(100vh-250px)]"
          />
        </CardContent>
      </Card>
    </div>
  );
}
