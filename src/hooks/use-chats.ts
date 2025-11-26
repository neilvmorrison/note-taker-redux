import { getChatsByUserId, Chat } from "@/lib/chats";
import { useEffect, useState } from "react";

export default function useChats() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<Chat[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchChats() {
      try {
        setLoading(true);
        const chats = await getChatsByUserId();
        setData(chats);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchChats();
  }, []);

  return {
    data,
    isLoading,
    isError: !!error,
    error,
  };
}

