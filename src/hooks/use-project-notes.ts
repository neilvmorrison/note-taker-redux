import { Note, getAllProjectNotes } from "@/lib/notes";
import { useEffect, useState } from "react";

export default function useProjectNotes(projectSlug: string) {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<Note[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProjectNotes() {
      try {
        setLoading(true);
        const notes = await getAllProjectNotes(projectSlug);
        setData(notes as Note[]);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }

    if (projectSlug) {
      fetchProjectNotes();
    }
  }, [projectSlug]);

  return {
    data,
    isLoading,
    isError: !!error,
    error,
  };
}
