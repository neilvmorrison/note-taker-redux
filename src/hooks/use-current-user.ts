import { getCurrentUser, UserProfile } from "@/lib/auth";
import { useEffect, useState } from "react";

export function useCurrentUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setIsLoading(true);
        const user = await getCurrentUser();
        setUser(user);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  return {
    user,
    isLoading,
    isError: !!error,
    error,
  };
}
