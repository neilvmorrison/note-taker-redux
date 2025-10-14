"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getNoteById, updateNote } from "@/lib/notes";
import TiptapEditor from "@/components/editor/tiptap-editor";
import { useAutoSave } from "@/hooks/use-auto-save";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Save, ArrowLeft } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { ProjectNoteSelector } from "@/components/project-note-selector";
import { NoteHistoryDrawer } from "@/components/note-history-drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Icon from "@/components/ui/icons";

export default function NoteDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<{
    id: string;
    title: string;
    content: string;
    project_id: string | null;
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
        if (!noteData) {
          setNote(null);
          return;
        }
        setNote({
          id: noteData.id,
          title: noteData.title || "Untitled Note",
          content: noteData.content ? String(noteData.content) : "",
          project_id: noteData.project_id ?? null,
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
      <div className="block lg:flex items-center justify-between sticky top-0 bg-background z-10 py-2">
        <div className="flex items-center gap-3 mb-3 lg:mb-0">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {hasPendingChanges && (
            <Icon name="alert" className="text-amber-500" />
          )}
          <Input
            value={note.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="font-bold py-1 max-w-sm h-auto border-none focus:border"
            placeholder="Untitled Note"
          />
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <ProjectNoteSelector
                  noteId={note.id}
                  projectId={note.project_id}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Assign this note to a project</p>
            </TooltipContent>
          </Tooltip>
          <div className="flex items-center gap-2">
            <NoteHistoryDrawer noteId={note.id} />
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
      </div>

      {saveError && (
        <Alert variant="destructive" className="my-2">
          Failed to save note. Please try again.
        </Alert>
      )}

      <div className="flex-grow lg:max-w-[768px] border-0 shadow-none">
        <TiptapEditor
          content={note.content}
          onChange={handleContentChange}
          placeholder="Start writing your note..."
          className="min-h-[calc(100vh-250px)]"
        />
      </div>
    </div>
  );
}
