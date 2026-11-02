import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { EASE_OUT, VIEWPORT } from './presets';

const TAGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p, span: motion.span };

type Token = { word: string; className?: string; style?: React.CSSProperties };

type SplitTextProps = {
  /** Plain text, optionally mixed with <span className="…"> runs (e.g. an accent word). */
  children: ReactNode;
  as?: keyof typeof TAGS;
  className?: string;
  delay?: number;
  step?: number;
  /** Drive the reveal manually (e.g. after the preloader); otherwise it plays on scroll into view. */
  play?: boolean;
};

function tokenize(children: ReactNode): Token[] {
  return Children.toArray(children).flatMap(child => {
    if (typeof child === 'string' || typeof child === 'number') {
      return String(child).split(/\s+/).filter(Boolean).map(word => ({ word }));
    }
    if (isValidElement(child)) {
      const el = child as ReactElement<{ children?: ReactNode; className?: string; style?: React.CSSProperties }>;
      return String(el.props.children ?? '')
        .split(/\s+/)
        .filter(Boolean)
        .map(word => ({ word, className: el.props.className, style: el.props.style }));
    }
    return [];
  });
}

/** Masked word-by-word rise — each word slides up from behind its own clipping box. */
export function SplitText({ children, as = 'h2', className, delay = 0, step = 0.045, play }: SplitTextProps) {
  const Tag = TAGS[as];
  const tokens = tokenize(children);
  const trigger = play === undefined ? { whileInView: 'show', viewport: VIEWPORT } : { animate: play ? 'show' : 'hidden' };

  return (
    <Tag className={className} initial="hidden" {...trigger}>
      <span className="visually-hidden">{tokens.map(t => t.word).join(' ')}</span>
      <span aria-hidden="true">
        {tokens.map((t, i) => (
          <span key={i}>
            <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.1em', marginBottom: '-0.1em' }}>
              <motion.span
                className={t.className}
                style={{ display: 'inline-block', willChange: 'transform', ...t.style }}
                variants={{
                  hidden: { y: '110%', rotate: 4 },
                  show: { y: '0%', rotate: 0, transition: { duration: 1, ease: EASE_OUT, delay: delay + i * step } },
                }}
              >
                {t.word}
              </motion.span>
            </span>
            {i < tokens.length - 1 && ' '}
          </span>
        ))}
      </span>
    </Tag>
  );
}
