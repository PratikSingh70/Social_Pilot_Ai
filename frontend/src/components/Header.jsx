import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import ThemeToggle from './ThemeToggle';
import GlobalSearch from './GlobalSearch';
import { Bell, Menu, ArrowLeft, LogOut } from 'lucide-react';

/**
 * Sticky Header with dynamic shrink on scroll past 100px, safe-area insets,
 * accessible hamburger button, Global Search combobox, and dark theme toggle.
 */
export default function Header({ onToggleSidebar, sidebarOpen, triggerRef, crumb = 'Workspace' }) {
  const { user, logout } = useAuth();
  const { show } = useToast();
  const nav = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      className={`sticky top-0 z-30 border-b transition-all duration-200 flex items-center justify-between px-4 sm:px-6 ${
        scrolled
          ? 'h-14 bg-bg/90 backdrop-blur-xl border-white/[0.1] shadow-md'
          : 'h-16 bg-bg/70 backdrop-blur-md border-white/[0.06]'
      }`}
    >
      {/* Left section: Hamburger + breadcrumb / page title */}
      <div className="flex items-center gap-3">
        <button
          ref={triggerRef}
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation drawer"
          aria-expanded={sidebarOpen}
          aria-controls="navigation-drawer"
          className="icon-btn lg:hidden text-text-2 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xs sm:text-sm font-medium text-text-2 hidden sm:inline-block">
          {crumb}
        </span>
      </div>

      {/* Middle section: Global search */}
      <div className="mx-2 flex-1 max-w-xs sm:max-w-sm md:max-w-md flex justify-center">
        <GlobalSearch />
      </div>

      {/* Right section: Links, ThemeToggle, Notifications, User profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        <Link
          to="/"
          className="hidden md:flex items-center gap-1 text-xs text-text-3 hover:text-white transition px-2 py-1.5 rounded-lg"
          title="Return to landing page"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Landing
        </Link>

        <ThemeToggle />

        <button
          type="button"
          onClick={() => show('You have 3 new automated social insights', 'ai')}
          aria-label="View notifications"
          className="icon-btn text-text-2 hover:text-white relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span
            className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error border border-bg"
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          onClick={() => {
            logout();
            nav('/');
          }}
          aria-label="Sign out"
          title="Sign out"
          className="hidden sm:inline-flex text-xs text-text-3 hover:text-white transition px-2 py-1.5 rounded-lg"
        >
          <LogOut className="w-4 h-4 mr-1 sm:inline hidden" /> Sign out
        </button>

        <button
          type="button"
          onClick={() => nav('/app/settings')}
          title={user?.name ? `${user.name} — Click for Settings` : 'User profile & settings'}
          aria-label="User profile and account settings"
          className="w-8 h-8 rounded-full bg-ai hover:ring-2 hover:ring-accent/60 transition-all grid place-items-center text-xs font-semibold text-white cursor-pointer shadow-sm select-none"
        >
          {user?.name?.[0] || 'A'}
        </button>
      </div>
    </header>
  );
}