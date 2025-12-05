import { useCallback, useEffect, useRef } from "react";

interface UseDebounceOptions {
  delay?: number;
}

interface UseDebounceReturn {
  debounce: <T extends (...args: unknown[]) => void>(callback: T) => void;
}

const useDebounce = ({
  delay = 500,
}: UseDebounceOptions = {}): UseDebounceReturn => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debounce = useCallback(
    <T extends (...args: unknown[]) => void>(callback: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback();
        timeoutRef.current = null;
      }, delay);
    },
    [delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { debounce };
};

export default useDebounce;
