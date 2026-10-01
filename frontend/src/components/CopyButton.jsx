import { useState, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

/**
 * CopyButton component with clipboard fallback, ARIA live announcement, and timeout reset.
 * @param {{ text: string, label?: string, className?: string, iconOnly?: boolean }} props
 */
export default function CopyButton({
  text,
  label = 'Copy',
  className = '',
  iconOnly = false,
}) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  const handleCopy = async () => {
    if (!text) return;

    let success = false;
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch {
        success = false;
      }
    }

    // Fallback for older browsers or non-secure contexts
    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        success = true;
      } catch (err) {
        console.error('Failed to copy to clipboard', err);
      }
    }

    if (success) {
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied to clipboard' : label}
      title={copied ? 'Copied!' : label}
      className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] transition-all duration-200 ${
        copied
          ? 'bg-success/15 border-success/30 text-success'
          : 'bg-white/[0.04] text-text-2 hover:bg-white/[0.08] hover:text-white'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-success" />
          {!iconOnly && <span>Copied!</span>}
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          {!iconOnly && <span>{label}</span>}
        </>
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? 'Content copied to clipboard successfully' : ''}
      </span>
    </button>
  );
}
