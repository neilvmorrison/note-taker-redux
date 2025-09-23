import { getAllNotes as _getAllNotes, Note } from "@/lib/notes";
import { useEffect, useState } from "react";

export default function useNotes() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<Note[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function getAllNotes() {
      try {
        setLoading(true);
        const notes = await _getAllNotes();
        setData(notes);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }
    getAllNotes();
  }, []);

  return {
    data,
    isLoading,
    isError: !!error,
    error,
  };
}
