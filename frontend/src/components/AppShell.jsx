import { useState, useRef } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import SkipToContent from './SkipToContent';
import BackToTop from './BackToTop';

const CRUMBS = {
  '/app/dashboard': 'Dashboard',
  '/app/ai-studio': 'AI Studio',
  '/app/create': 'Create Post',
  '/app/calendar': 'Content Calendar',
  '/app/library': 'Content Library',
  '/app/analytics': 'Analytics',
  '/app/insights': 'AI Insights',
  '/app/accounts': 'Connected Accounts',
  '/app/settings': 'Settings',
  '/app/search': 'Search Results',
};

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const triggerRef = useRef(null);
  const { pathname } = useLocation();
  const crumb = CRUMBS[pathname] || 'Workspace';

  return (
    <div className="flex min-h-screen bg-bg text-white relative">
      <SkipToContent targetId="main-content" />
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        triggerRef={triggerRef}
      />
      <div className="flex-1 lg:ml-[260px] min-w-0 flex flex-col">
        <Header
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          sidebarOpen={sidebarOpen}
          triggerRef={triggerRef}
          crumb={crumb}
        />
        <main id="main-content" tabIndex={-1} className="flex-1 max-w-[1400px] w-full mx-auto p-4 lg:p-6 pb-24 lg:pb-6 focus:outline-none">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <BackToTop />
    </div>
  );
}

function BottomNav() {
  const items = [
    { to: '/app/dashboard', ic: '🏠', l: 'Home' },
    { to: '/app/ai-studio', ic: '✨', l: 'Create' },
    { to: '/app/calendar', ic: '📅', l: 'Calendar' },
    { to: '/app/analytics', ic: '📊', l: 'Stats' },
    { to: '/app/settings', ic: '👤', l: 'Profile' },
  ];
  return (
    <nav
      aria-label="Mobile navigation"
      className="bottom-nav lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d12]/95 backdrop-blur-md border-t border-white/[0.06] py-2 grid grid-cols-5"
    >
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          className="flex flex-col items-center gap-1 py-1 text-[10px] text-text-3"
        >
          {({ isActive }) => (
            <>
              <span className={`text-lg ${isActive ? 'text-accent' : ''}`}>{it.ic}</span>
              <span className={isActive ? 'text-accent font-medium' : ''}>{it.l}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}