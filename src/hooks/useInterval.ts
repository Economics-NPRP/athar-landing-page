import { useEffect, useRef } from 'react';

/** setInterval that always calls the latest callback and skips ticks while the tab is hidden. */
export function useInterval(callback: () => void, ms: number | null) {
  const saved = useRef(callback);
  saved.current = callback;

  useEffect(() => {
    if (ms === null) return;
    const id = setInterval(() => !document.hidden && saved.current(), ms);
    return () => clearInterval(id);
  }, [ms]);
}
