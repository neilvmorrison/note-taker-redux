import { getChatsByUserId, Chat } from "@/lib/chats";
import { useEffect, useState } from "react";

interface IUseChatsParams {
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

export default function useChats({
  searchTerm,
  limit = 50,
  offset = 0,
}: IUseChatsParams = {}) {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<Chat[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchChats() {
      try {
        setLoading(true);
        const chats = await getChatsByUserId({
          limit,
          offset,
          title: searchTerm,
        });
        setData(chats);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchChats();
  }, [searchTerm, limit, offset]);

  return {
    data,
    isLoading,
    isError: !!error,
    error,
  };
}
