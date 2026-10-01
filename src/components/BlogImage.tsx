import type { ImgHTMLAttributes } from 'react';
import images from '@/content/blog-images.json';

type ImageEntry = { src: string; width: number; height: number; variants: { src: string; width: number }[] };
type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & { src?: string; alt: string; priority?: boolean };

export function BlogImage({ src = '/og-image.png', alt, priority = false, sizes = '(min-width: 1024px) 50vw, 100vw', ...props }: Props) {
  const normalized = /^https?:\/\//.test(src) ? src : '/' + src.replace(/^\/+/, '');
  const image = (images as Record<string, ImageEntry>)[normalized];
  return <img
    {...props}
    src={image?.src || normalized}
    srcSet={image?.variants.map(variant => variant.src + ' ' + variant.width + 'w').join(', ')}
    sizes={image ? sizes : undefined}
    width={image?.width}
    height={image?.height}
    alt={alt}
    loading={priority ? 'eager' : 'lazy'}
    fetchPriority={priority ? 'high' : 'auto'}
    decoding="async"
    onError={event => {
      const target = event.currentTarget;
      if (target.dataset.fallback) return;
      target.dataset.fallback = 'true';
      target.removeAttribute('srcset');
      target.src = (images as Record<string, ImageEntry>)['/og-image.png']?.src || '/og-image.png';
    }}
  />;
}
