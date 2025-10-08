"use client";

import { useState, useEffect } from "react";
import { getNoteActions } from "@/lib/notes";
import { NoteAction } from "@/lib/notes";

export function useNoteHistory(noteId: string | null) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actions, setActions] = useState<NoteAction[]>([]);

  useEffect(() => {
    async function fetchNoteActions() {
      if (!noteId) {
        setActions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const noteActions = await getNoteActions(noteId);
        setActions(noteActions || []);
      } catch (err) {
        console.error("Failed to load note history:", err);
        setError("Failed to load note history");
      } finally {
        setLoading(false);
      }
    }

    fetchNoteActions();
  }, [noteId]);

  return {
    loading,
    error,
    actions,
  };
}
