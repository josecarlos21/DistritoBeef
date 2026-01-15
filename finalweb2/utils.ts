
import { useState, useEffect } from 'react';
import { PLACEHOLDER_IMG } from './constants';

// Classname utility (DRY)
export const cx = (...x: (string | 0 | null | undefined | false)[]) => x.filter(Boolean).join(" ");

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export const getHour = (iso: string) => ((iso.split("T")[1] || "").slice(0, 5));

// Helper to get full header like "Sábado, 24 de Enero"
export const getFullDateLabel = (isoString: string) => {
  // Create date object. Note: ISO strings without Z are treated as local time, which is desired here for fixed event times.
  const date = new Date(isoString);
  
  const formatter = new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  
  return formatter.format(date); // e.g., "sábado, 24 de enero"
};

// Optimized Background Style Generator
export const getEventBackgroundStyle = (image: string | undefined, track: string, id: string) => {
  if (image && image.length > 5) {
    return { backgroundImage: `url("${image}")` };
  }

  const gradients = [
    "linear-gradient(135deg, #4a192c 0%, #a85718 100%)", // Sunset
    "linear-gradient(135deg, #0f3d3e 0%, #105b63 100%)", // Ocean
    "linear-gradient(135deg, #1a0b0b 0%, #4a0e0e 100%)", // Night
    "linear-gradient(135deg, #2b1d12 0%, #5a3a25 100%)"  // Earth
  ];

  let index = 3;
  if (track === 'beefdip') index = 0;
  else if (track === 'bearadise') index = 2; 
  else if (track === 'community') index = 1; 
  else {
    const charCode = id.charCodeAt(id.length - 1);
    index = charCode % 4;
  }

  return { background: gradients[index] };
};

// Haptic Feedback Utility (Safe Check)
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
        switch (type) {
        case 'light': navigator.vibrate(10); break;
        case 'medium': navigator.vibrate(20); break;
        case 'heavy': navigator.vibrate(40); break;
        case 'success': navigator.vibrate([10, 30, 10]); break;
        case 'error': navigator.vibrate([50, 30, 50, 30, 50]); break;
        }
    } catch (e) {
        // Ignore haptic errors on unsupported devices
    }
  }
};

// Image Loader Hook with Cache Support
export const useImageLoading = (src: string, id?: string) => {
  const [loadedSrc, setLoadedSrc] = useState(PLACEHOLDER_IMG);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    // 1. Check Local Storage (for previously generated/saved images)
    if (id) {
        const local = localStorage.getItem(`img_${id}`);
        if (local) {
            setLoadedSrc(local);
            setIsLoaded(true);
            return;
        }
    }

    // 2. Load Remote
    const img = new Image();
    img.src = src;
    img.onload = () => {
        if (active) {
            setLoadedSrc(src);
            setIsLoaded(true);
        }
    };
    img.onerror = () => {
        // Keep placeholder or handle error
    };

    return () => { active = false; };
  }, [src, id]);

  return { src: loadedSrc, isLoaded };
};

export const saveToLocalCache = (id: string, dataUrl: string) => {
    try {
        localStorage.setItem(`img_${id}`, dataUrl);
    } catch (e) {
        console.warn('Storage quota exceeded or disabled');
    }
};
