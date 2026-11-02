import type { ReactNode } from 'react';
import { Icon } from './Icon';

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: 'mint' | 'light' | 'ghost';
  size?: 'md' | 'sm';
  arrow?: boolean;
  className?: string;
  onClick?: () => void;
};

/** Anchor styled as a button, with the fill-wipe hover from global.css. */
export function ButtonLink({ href, children, variant = 'mint', size = 'md', arrow, className = '', onClick }: ButtonLinkProps) {
  return (
    <a href={href} onClick={onClick} className={`btn btn--${variant} ${size === 'sm' ? 'btn--sm' : ''} ${className}`}>
      {children}
      {arrow && <Icon name="arrow" size={size === 'sm' ? 16 : 18} data-arrow />}
    </a>
  );
}
