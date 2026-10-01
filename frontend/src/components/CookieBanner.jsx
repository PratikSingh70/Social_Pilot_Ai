import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';

/**
 * CookieConsentBanner handles GDPR/CCPA cookie preferences with no dark patterns.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('sp_cookie_consent');
      if (!consent) {
        setVisible(true);
      }
    } catch {
      // LocalStorage unavailable
      setVisible(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && visible) {
        handleChoice('dismissed');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible]);

  const handleChoice = (choice) => {
    try {
      const payload = {
        choice,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('sp_cookie_consent', JSON.stringify(payload));
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="region"
      aria-label="Cookie consent banner"
      className="cookie-banner fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-40 p-4 sm:p-5 rounded-2xl bg-card/95 border border-border shadow-glow backdrop-blur-md transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent grid place-items-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">We value your privacy</h3>
            <button
              onClick={() => handleChoice('dismissed')}
              aria-label="Close cookie banner"
              className="text-text-3 hover:text-white p-1 rounded-md transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-1 text-xs text-text-2 leading-relaxed">
            We use cookies to analyze performance, provide personalized analytics, and deliver a better user experience.{' '}
            <Link to="/privacy" className="text-accent hover:underline font-medium">
              Read our Privacy Policy
            </Link>.
          </p>
          <div className="mt-4 flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleChoice('accepted')}
              className="btn btn-primary flex-1 h-9 text-xs"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={() => handleChoice('rejected')}
              className="btn btn-outline flex-1 h-9 text-xs"
            >
              Decline non-essential
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
