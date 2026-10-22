import { useState, useEffect } from 'react';

// Shared breakpoints: mobile <= 768, tablet 769-1024, desktop > 1024
const read = () => {
  const w = window.innerWidth;
  return { width: w, isMobile: w <= 768, isTablet: w > 768 && w <= 1024, isDesktop: w > 1024 };
};

export default function useBreakpoint() {
  const [bp, setBp] = useState(read);
  useEffect(() => {
    const onResize = () => setBp(read());
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);
  return bp;
}
