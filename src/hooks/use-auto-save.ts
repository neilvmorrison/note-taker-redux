"use client";

import { useCallback, useEffect, useState } from "react";

interface AutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  interval?: number;
  debounce?: number;
}

/**
 * A hook that provides auto-save functionality
 *
 * @param options.data The data to be auto-saved
 * @param options.onSave Function that performs the save operation
 * @param options.interval How often to check for changes (in ms, default: 1000)
 * @param options.debounce Time to wait after last change before saving (in ms, default: 5000)
 */
export function useAutoSave<T>({
  data,
  onSave,
  interval = 1000,
  debounce = 5000,
}: AutoSaveOptions<T>) {
  const [lastSaved, setLastSaved] = useState<T>(data);
  const [lastChanged, setLastChanged] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Handle initial data and subsequent updates
  useEffect(() => {
    if (isInitialLoad) {
      // On initial load, just update lastSaved without marking as changed
      setLastSaved(data);
      setIsInitialLoad(false);
    } else if (JSON.stringify(data) !== JSON.stringify(lastSaved)) {
      // Only mark as changed after initial load and if data differs
      setLastChanged(Date.now());
    }
  }, [data, lastSaved, isInitialLoad]);

  // The save function to be called
  const save = useCallback(async () => {
    if (
      isInitialLoad ||
      !lastChanged ||
      JSON.stringify(data) === JSON.stringify(lastSaved)
    ) {
      return;
    }

    try {
      setIsSaving(true);
      await onSave(data);
      setLastSaved(data);
      setLastChanged(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to save"));
    } finally {
      setIsSaving(false);
    }
  }, [data, lastChanged, lastSaved, onSave, isInitialLoad]);

  // Set up the interval to check for pending saves
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (lastChanged && Date.now() - lastChanged >= debounce && !isSaving) {
        save();
      }
    }, interval);

    return () => clearInterval(checkInterval);
  }, [lastChanged, save, debounce, interval, isSaving]);

  // Function to force a save immediately
  const forceSave = useCallback(async () => {
    if (!isInitialLoad && JSON.stringify(data) !== JSON.stringify(lastSaved)) {
      await save();
    }
  }, [data, lastSaved, save, isInitialLoad]);

  return {
    isSaving,
    error,
    forceSave,
    hasPendingChanges: !isInitialLoad && lastChanged !== null,
  };
}
