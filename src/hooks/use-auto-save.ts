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
  // Use refs to track initial data and initialization state
  const [initialDataHash, setInitialDataHash] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<T>(data);
  const [lastChanged, setLastChanged] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Initialize with the first non-null data
  useEffect(() => {
    if (isFirstLoad && data !== null && data !== undefined) {
      const hash = JSON.stringify(data);
      setInitialDataHash(hash);
      setLastSaved(data);
      setIsFirstLoad(false);
    }
  }, [data, isFirstLoad]);

  // Detect changes after initialization
  useEffect(() => {
    // Skip if we haven't initialized yet
    if (isFirstLoad || initialDataHash === null) {
      return;
    }

    const currentDataHash = JSON.stringify(data);

    // If data differs from what was last saved, mark as changed
    if (currentDataHash !== JSON.stringify(lastSaved)) {
      setLastChanged(Date.now());
    }
  }, [data, lastSaved, initialDataHash, isFirstLoad]);

  // The save function to be called
  const save = useCallback(async () => {
    if (
      isFirstLoad ||
      initialDataHash === null ||
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
  }, [data, lastChanged, lastSaved, onSave, isFirstLoad, initialDataHash]);

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
    if (
      !isFirstLoad &&
      initialDataHash !== null &&
      JSON.stringify(data) !== JSON.stringify(lastSaved)
    ) {
      await save();
    }
  }, [data, lastSaved, save, isFirstLoad, initialDataHash]);

  // We only consider there to be pending changes if:
  // 1. We've completed initialization
  // 2. The current data is different from what was loaded initially
  // 3. There's a pending change timestamp
  const hasPendingChanges =
    !isFirstLoad &&
    initialDataHash !== null &&
    JSON.stringify(data) !== initialDataHash &&
    lastChanged !== null;

  return {
    isSaving,
    error,
    forceSave,
    hasPendingChanges,
  };
}
