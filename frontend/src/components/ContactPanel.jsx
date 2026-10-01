import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MessageSquare, X, Send, HelpCircle, Calendar, Mail, CheckCircle2 } from 'lucide-react';
import { ButtonSpinner } from './Skeleton';

/**
 * Floating contact button and accessible slide-in support panel.
 * Shown on public pages (Landing, FAQ, Privacy, Terms, Login, SignUp) and hidden in /app/*.
 */
export default function ContactPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('form'); // 'form' | 'links'
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  // Hidden on authenticated app routes
  const isAppRoute = location.pathname.startsWith('/app');

  useEffect(() => {
    if (!isOpen) return;

    // Body scroll lock on mobile
    const originalOverflow = document.body.style.overflow;
    if (window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    }

    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll('button, input, textarea, a[href]');
    focusables?.[0]?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (e.key === 'Tab' && focusables) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (isAppRoute) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);

    // Simulated API call (will be connected to backend contact endpoint later)
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    }, 900);
  };

  return (
    <>
      {/* Floating launcher button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open contact panel"
        aria-expanded={isOpen}
        className="floating-contact no-print fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-ai text-white shadow-ai flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-white"
        title="Contact support"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          role="presentation"
          onClick={() => {
            setIsOpen(false);
            triggerRef.current?.focus();
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 sm:hidden"
        />
      )}

      {/* Slide-in panel */}
      {isOpen && (
        <aside
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Contact and support panel"
          className="contact-panel no-print fixed inset-0 sm:inset-auto sm:bottom-20 sm:right-5 z-50 w-full sm:w-[380px] sm:max-h-[580px] bg-card border border-border sm:rounded-2xl shadow-glow flex flex-col overflow-hidden animate-slideIn"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-ai grid place-items-center text-white">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-semibold text-white">How can we help?</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Close contact panel"
              className="p-1 rounded-md text-text-3 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="px-4 pt-3 flex border-b border-white/[0.06] text-xs">
            <button
              type="button"
              onClick={() => setMode('form')}
              className={`pb-2 px-3 font-medium transition border-b-2 ${
                mode === 'form' ? 'border-accent text-white' : 'border-transparent text-text-3 hover:text-text-2'
              }`}
            >
              Send Message
            </button>
            <button
              type="button"
              onClick={() => setMode('links')}
              className={`pb-2 px-3 font-medium transition border-b-2 ${
                mode === 'links' ? 'border-accent text-white' : 'border-transparent text-text-3 hover:text-text-2'
              }`}
            >
              Quick Options
            </button>
          </div>

          {/* Body */}
          <div className="p-4 flex-1 overflow-y-auto">
            {mode === 'form' ? (
              submitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-success/15 text-success grid place-items-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Message Received!</h3>
                  <p className="text-xs text-text-2 leading-relaxed">
                    Thanks for reaching out. Our support team typically replies within 2 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn btn-outline btn-sm text-xs mt-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {error && (
                    <div className="p-2.5 rounded-lg bg-error/15 border border-error/30 text-error text-xs" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="field">
                    <label htmlFor="contact-name">Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Alex Morgan"
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="contact-email">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@example.com"
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="contact-message">Message</label>
                    <textarea
                      id="contact-message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help your team?"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary w-full text-xs h-9 mt-1"
                  >
                    {submitting ? <ButtonSpinner label="Sending…" /> : <span className="inline-flex items-center gap-1.5"><Send className="w-3.5 h-3.5" /> Send message</span>}
                  </button>
                </form>
              )
            ) : (
              <div className="space-y-2.5">
                <a
                  href="mailto:support@socialpilot.ai"
                  className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] transition flex items-center gap-3 text-xs text-text-2 hover:text-white"
                >
                  <Mail className="w-4 h-4 text-accent" />
                  <div>
                    <div className="font-semibold text-white">Email support</div>
                    <div className="text-[11px] text-text-3">support@socialpilot.ai</div>
                  </div>
                </a>

                <a
                  href="https://cal.com/socialpilot-ai"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] transition flex items-center gap-3 text-xs text-text-2 hover:text-white"
                >
                  <Calendar className="w-4 h-4 text-cyan" />
                  <div>
                    <div className="font-semibold text-white">Book a 15-min demo</div>
                    <div className="text-[11px] text-text-3">Speak with a product specialist</div>
                  </div>
                </a>

                <Link
                  to="/faq"
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] transition flex items-center gap-3 text-xs text-text-2 hover:text-white"
                >
                  <HelpCircle className="w-4 h-4 text-success" />
                  <div>
                    <div className="font-semibold text-white">Browse FAQ</div>
                    <div className="text-[11px] text-text-3">Find instant answers to common questions</div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
}
