import * as React from "react";

const MOBILE_BREAKPOINT = 768;

// Store the initial state outside the component to avoid unnecessary rerenders
let isMobileCache: boolean | null = null;

export function useMobile() {
  const isMobile = useIsMobileInternal();
  return { isMobile };
}

function useIsMobileInternal() {
  // Use a ref to track previous value to prevent unnecessary rerenders
  const prevMobileRef = React.useRef<boolean | null>(isMobileCache);
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initialize on client-side if possible
    if (typeof window !== "undefined") {
      const value = window.innerWidth < MOBILE_BREAKPOINT;
      isMobileCache = value;
      return value;
    }
    return false; // Default to non-mobile on server side
  });

  React.useEffect(() => {
    // Update the ref during effect
    prevMobileRef.current = isMobile;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Debounced onChange handler to prevent rapid state changes
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const onChange = () => {
      const newValue = window.innerWidth < MOBILE_BREAKPOINT;

      // Only update state if the value actually changed
      if (newValue !== prevMobileRef.current) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
          setIsMobile(newValue);
          isMobileCache = newValue;
          prevMobileRef.current = newValue;
          timeoutId = null;
        }, 150); // Debounce resize events
      }
    };

    mql.addEventListener("change", onChange);

    // Initial check
    onChange();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      mql.removeEventListener("change", onChange);
    };
  }, []);

  return isMobile;
}
