import React from 'react';
import { EVENT_PLACEHOLDER, AVATAR_PLACEHOLDER } from '@/utils';

type SmartImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  placeholderType?: 'event' | 'avatar';
};

// Keeps a local placeholder until the remote image loads; on error, it sticks to the placeholder.
export const SmartImage: React.FC<SmartImageProps> = ({ src, placeholderType = 'event', alt = '', ...rest }) => {
  const placeholder = placeholderType === 'avatar' ? AVATAR_PLACEHOLDER : EVENT_PLACEHOLDER;
  const [currentSrc, setCurrentSrc] = React.useState<string>(placeholder);

  React.useEffect(() => {
    if (!src || src.length < 6) {
      setCurrentSrc(placeholder);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setCurrentSrc(src);
    img.onerror = () => setCurrentSrc(placeholder);
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, placeholder]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={rest.loading || 'lazy'}
      {...rest}
    />
  );
};
