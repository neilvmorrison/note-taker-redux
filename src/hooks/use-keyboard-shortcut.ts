import { useEffect, useMemo } from "react";

interface IUseKeyboardShortcutOptions {
  withControl: boolean;
}

interface IUseKeyboardShortcutInit {
  key: string;
  callback: () => void;
  options?: IUseKeyboardShortcutOptions;
}

const defaultOptions = {
  withControl: true,
};

export default function useKeyboardShortcut({
  key,
  callback,
  options,
}: IUseKeyboardShortcutInit) {
  const opts = useMemo(() => ({ ...defaultOptions, ...options }), [options]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (opts.withControl) {
        if (event.key === key && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          callback();
        }
      } else {
        if (event.key === key) {
          event.preventDefault();
          callback();
        }
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [key, callback, opts]);
}
