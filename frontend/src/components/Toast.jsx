import { createContext, useCallback, useContext, useState } from 'react';

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

const ICONS = { success: '✓', error: '⚠', ai: '✨', info: 'ℹ' };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((msg, type = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-slideIn flex items-center gap-2.5 px-4 py-3 rounded-xl min-w-[280px]
              bg-card border shadow-glow text-[13px]
              ${t.type === 'success' ? 'border-success/30' : ''}
              ${t.type === 'error' ? 'border-error/30' : ''}
              ${t.type === 'ai' ? 'border-accent/30' : ''}
              ${t.type === 'info' ? 'border-border' : ''}`}
          >
            <span className={`
              ${t.type === 'success' ? 'text-success' : ''}
              ${t.type === 'error' ? 'text-error' : ''}
              ${t.type === 'ai' ? 'text-accent' : ''}
              ${t.type === 'info' ? 'text-text-2' : ''}`}>
              {ICONS[t.type] || '✓'}
            </span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}