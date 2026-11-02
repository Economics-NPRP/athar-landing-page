import type { CSSProperties } from 'react';
import { ICONS, type IconName } from '../../content/icons';

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  /** Status glyphs are solid shapes rather than strokes. */
  solid?: boolean;
  className?: string;
  style?: CSSProperties;
  'data-arrow'?: boolean;
};

export function Icon({ name, size, color, solid, className, style, ...rest }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      style={{
        width: '1em',
        height: '1em',
        flex: 'none',
        display: 'inline-block',
        verticalAlign: '-0.125em',
        fill: solid ? 'currentColor' : 'none',
        stroke: solid ? 'none' : 'currentColor',
        strokeWidth: 1.6,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        fontSize: size,
        color,
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
      {...rest}
    />
  );
}
