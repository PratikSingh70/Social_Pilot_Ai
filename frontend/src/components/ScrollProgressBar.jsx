import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ELIGIBLE_PATHS = ['/', '/faq', '/privacy', '/terms', '/cookies'];

/**
 * ScrollProgressBar renders a 2px top progress bar using transform: scaleX()
 * to prevent layout recalculations. Visible on long narrative and policy pages.
 */
export default function ScrollProgressBar() {
  const [scale, setScale] = useState(0);
  const location = useLocation();

  const isEligible = ELIGIBLE_PATHS.includes(location.pathname);

  useEffect(() => {
    if (!isEligible) {
      setScale(0);
      return;
    }

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrolled = Math.min(Math.max(window.scrollY / docHeight, 0), 1);
        setScale(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isEligible, location.pathname]);

  if (!isEligible) return null;

  return (
    <div
      aria-hidden="true"
      className="scroll-progress-bar fixed top-0 left-0 right-0 h-[2px] z-[999] pointer-events-none origin-left bg-ai transition-transform duration-75"
      style={{ transform: `scaleX(${scale})` }}
    />
  );
}
