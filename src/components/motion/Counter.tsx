import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { EASE_OUT } from './presets';

/** Counts the numeric part of a label up from zero when it scrolls into view ("<2 min", "32.1", "100%"). */
export function Counter({ value, className, delay = 0 }: { value: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
    if (!el || !match || reduce) return;
    const [, prefix, num, suffix] = match;
    const target = parseFloat(num.replace(/,/g, ''));
    const decimals = num.split('.')[1]?.length ?? 0;
    const render = (v: number) => (el.textContent = prefix + v.toFixed(decimals) + suffix);
    if (!inView) {
      render(0);
      return;
    }
    const controls = animate(0, target, { duration: 1.8, delay, ease: EASE_OUT, onUpdate: render });
    return () => controls.stop();
  }, [inView, value, reduce, delay]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {value}
    </span>
  );
}
