import { useRef, useState } from 'react';

/** Copies text to the clipboard and reports `key` (or `key-fail`) for 1.8 s. */
export function useCopy() {
  const [copied, setCopied] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = (text: string, key: string) => {
    const done = (state: string) => {
      setCopied(state);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(''), 1800);
    };
    if (!navigator.clipboard) return done(`${key}-fail`);
    navigator.clipboard.writeText(text).then(
      () => done(key),
      () => done(`${key}-fail`),
    );
  };

  return [copied, copy] as const;
}
