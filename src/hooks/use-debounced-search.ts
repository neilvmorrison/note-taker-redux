import { useEffect, useState } from "react";
import useDebounce from "./use-debounce";

export default function useDebouncedSearch<T>(searchString: string) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(searchString, 500);

  useEffect(() => {
    async function fetchData() {}
  });

  return {
    data,
    isLoading,
    isError: !!error,
  };
}
