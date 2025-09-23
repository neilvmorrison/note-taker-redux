import { useState } from "react";

export type ServerAction<TData, TResult> = (data: TData) => Promise<TResult>;

export default function useCreate<
  TData,
  TResult extends { success: boolean; message?: string }
>(serverAction: ServerAction<TData, TResult>) {
  const [isSuccess, setSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState(false);
  const createRecord = async (data: TData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await serverAction(data);
      if (response.success) {
        setSuccess(true);
        return response;
      } else {
        // Use a generic error message if one isn't provided.
        setError(new Error(response.message || "An unknown error occurred."));
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error("An unexpected error occurred."));
      }
    } finally {
      setLoading(false);
    }
  };

  return { createRecord, isLoading, error, isSuccess };
}
