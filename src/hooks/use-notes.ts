import { getAllNotes as _getAllNotes, Note } from "@/lib/notes";
import { useEffect, useState } from "react";

interface IUseNotesParams {
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

export default function useNotes({
  searchTerm,
  limit = 50,
  offset = 0,
}: IUseNotesParams = {}) {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<Note[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function getAllNotes() {
      try {
        setLoading(true);
        const notes = await _getAllNotes({ limit, offset, title: searchTerm });
        setData(notes);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }
    getAllNotes();
  }, [searchTerm, limit, offset]);

  return {
    data,
    isLoading,
    isError: !!error,
    error,
  };
}
