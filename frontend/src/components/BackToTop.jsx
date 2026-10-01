import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

/**
 * BackToTop button smoothly scrolls user back to the top of the page when scrolled down > 400px.
 * Automatically hidden on Landing page where landing has its own navigation flow.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  const isLanding = location.pathname === '/';

  useEffect(() => {
    if (isLanding) {
      setVisible(false);
      return;
    }

    const checkScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, [isLanding]);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  if (isLanding || !visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className="back-to-top fixed bottom-20 right-5 z-40 w-10 h-10 rounded-full bg-card/90 border border-border shadow-glow text-text-2 hover:text-white hover:border-accent/40 flex items-center justify-center transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent"
      title="Back to top"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}
