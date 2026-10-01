import { CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * FormSuccess alert message with accessible status role.
 * @param {{ message?: string, className?: string }} props
 */
export function FormSuccess({ message, className = '' }) {
  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-2.5 p-3 rounded-xl bg-success/10 border border-success/30 text-success text-xs font-medium animate-fadeIn ${className}`}
    >
      <CheckCircle2 className="w-4 h-4 shrink-0 text-success" />
      <span>{message}</span>
    </div>
  );
}

/**
 * FormErrorSummary displays an accessible summary of all form validation errors at the top of the form
 * with clickable jump links to focus the corresponding field.
 * @param {{ errors: Record<string, string>, className?: string }} props
 */
export function FormErrorSummary({ errors = {}, className = '' }) {
  const errorKeys = Object.keys(errors).filter((k) => Boolean(errors[k]));
  if (errorKeys.length === 0) return null;

  const handleJump = (fieldId) => {
    const el = document.getElementById(fieldId);
    el?.focus();
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div
      role="alert"
      aria-labelledby="error-summary-title"
      tabIndex={-1}
      className={`p-3.5 rounded-xl bg-error/10 border border-error/30 text-xs text-error space-y-2 mb-4 animate-fadeIn ${className}`}
    >
      <div className="flex items-center gap-2 font-semibold" id="error-summary-title">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>There {errorKeys.length === 1 ? 'is 1 error' : `are ${errorKeys.length} errors`} to fix:</span>
      </div>
      <ul className="list-disc list-inside space-y-1 pl-1 text-text-2">
        {errorKeys.map((key) => (
          <li key={key}>
            <button
              type="button"
              onClick={() => handleJump(key)}
              className="text-error underline hover:text-white transition text-left"
            >
              {errors[key]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * FieldError inline message linked via aria-describedby.
 * @param {{ id: string, message?: string }} props
 */
export function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={`${id}-error`} className="mt-1 text-xs text-error animate-fadeIn" role="alert">
      {message}
    </p>
  );
}
