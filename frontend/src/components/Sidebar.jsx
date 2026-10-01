import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Sparkles,
  PenSquare,
  CalendarDays,
  FolderOpen,
  BarChart3,
  Lightbulb,
  Share2,
  Settings as SettingsIcon,
  X,
  LogOut,
} from 'lucide-react';

const NAV = [
  {
    section: 'Workspace',
    items: [
      { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/app/ai-studio', icon: Sparkles, label: 'AI Studio', tag: 'AI' },
      { to: '/app/create', icon: PenSquare, label: 'Create Post' },
      { to: '/app/calendar', icon: CalendarDays, label: 'Calendar' },
      { to: '/app/library', icon: FolderOpen, label: 'Library' },
    ],
  },
  {
    section: 'Insights',
    items: [
      { to: '/app/analytics', icon: BarChart3, label: 'Analytics' },
      { to: '/app/insights', icon: Lightbulb, label: 'AI Insights' },
    ],
  },
  {
    section: 'Social',
    items: [{ to: '/app/accounts', icon: Share2, label: 'Accounts' }],
  },
  {
    section: 'Management',
    items: [{ to: '/app/settings', icon: SettingsIcon, label: 'Settings' }],
  },
];

/**
 * Mobile and Desktop accessible navigation sidebar drawer with focus trap,
 * keyboard controls, body-scroll lock, and aria-modal compliance.
 */
export default function Sidebar({ open, onClose, triggerRef }) {
  const { user, logout } = useAuth();
  const drawerRef = useRef(null);

  // Body scroll lock when open on mobile
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  // Focus trap and Escape key listener
  useEffect(() => {
    if (!open) return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusableElements = drawer.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex="0"]'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        triggerRef?.current?.focus();
        return;
      }

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      triggerRef?.current?.focus();
    };
  }, [open, onClose, triggerRef]);

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {open && (
        <div
          role="presentation"
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200"
        />
      )}

      <aside
        ref={drawerRef}
        role={open ? 'dialog' : undefined}
        aria-modal={open ? 'true' : undefined}
        aria-label="Navigation drawer"
        className={`fixed left-0 top-0 bottom-0 w-[260px] bg-[#0c0d12] border-r border-white/[0.06] flex flex-col z-50 transition-transform duration-200 motion-reduce:transition-none ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-5 h-16 flex items-center justify-between border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ai grid place-items-center shadow-ai text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[15px] font-semibold text-white tracking-tight">SocialPilot AI</span>
          </div>

          {/* Close button for mobile screen readers and keyboard users */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation sidebar"
            className="lg:hidden p-1.5 rounded-lg text-text-3 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {NAV.map((group) => (
            <div key={group.section}>
              <div className="text-[10px] font-semibold tracking-widest uppercase text-text-3 px-3 mb-2">
                {group.section}
              </div>
              <div className="space-y-0.5">
                {group.items.map((it) => {
                  const Icon = it.icon;
                  return (
                    <NavLink
                      key={it.to}
                      to={it.to}
                      onClick={onClose}
                      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                      <Icon className="w-4 h-4 text-text-3 shrink-0" />
                      <span className="truncate">{it.label}</span>
                      {it.tag && (
                        <span className="ml-auto text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md bg-ai">
                          {it.tag}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User profile / session footer */}
        <div className="p-3.5 border-t border-white/[0.06]">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.04] transition">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-ai grid place-items-center text-xs font-semibold text-white shrink-0">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-white truncate">{user?.name || 'Alex Morgan'}</div>
                <div className="text-[11px] text-text-3 truncate">{user?.email || 'alex@socialpilot.ai'}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label="Log out of application"
              title="Sign out"
              className="p-1.5 text-text-3 hover:text-error transition rounded-lg hover:bg-white/5"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}