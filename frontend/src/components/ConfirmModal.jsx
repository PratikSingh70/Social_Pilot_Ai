import { useEffect, useRef } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

/**
 * ConfirmModal component providing accessible confirmation dialogs with focus trap,
 * keyboard controls, backdrop dismiss, and danger variants.
 * @param {{
 *   isOpen: boolean,
 *   title: string,
 *   message: string,
 *   confirmLabel?: string,
 *   cancelLabel?: string,
 *   isDanger?: boolean,
 *   onConfirm: () => void,
 *   onCancel: () => void,
 *   triggerRef?: React.RefObject<HTMLElement>
 * }} props
 */
export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false,
  onConfirm,
  onCancel,
  triggerRef,
}) {
  const modalRef = useRef(null);
  const cancelBtnRef = useRef(null);

  // Focus trap and Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    // Body scroll lock
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus cancel button or modal initially
    cancelBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
        return;
      }

      if (e.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;
        const focusables = modal.querySelectorAll(
          'button:not([disabled]), [tabindex="0"]'
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      triggerRef?.current?.focus();
    };
  }, [isOpen, onCancel, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      onClick={onCancel}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
    >
      <div
        ref={modalRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-glow relative"
      >
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-text-3 hover:text-white p-1 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${
              isDanger ? 'bg-error/15 text-error' : 'bg-accent/15 text-accent'
            }`}
          >
            {isDanger ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <h2 id="confirm-modal-title" className="text-base font-semibold text-white">
              {title}
            </h2>
            <p id="confirm-modal-description" className="mt-2 text-xs text-text-2 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            className="btn btn-outline h-9 px-4 text-xs"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            className={`btn h-9 px-4 text-xs font-semibold ${
              isDanger
                ? 'bg-error text-white hover:bg-error/80'
                : 'btn-primary'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
