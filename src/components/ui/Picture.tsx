import type { ImgHTMLAttributes } from 'react';

type PictureProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  /** Path without extension; expects `<src>.avif` and a `<src>.jpg` fallback in public/. */
  src: string;
};

/** AVIF where supported, optimized JPEG otherwise. */
export function Picture({ src, alt = '', ...img }: PictureProps) {
  return (
    <picture>
      <source srcSet={`${src}.avif`} type="image/avif" />
      <img src={`${src}.jpg`} alt={alt} {...img} />
    </picture>
  );
}
