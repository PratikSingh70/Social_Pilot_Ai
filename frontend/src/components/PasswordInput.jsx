import { useState, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Accessible PasswordInput with toggle visibility button, maintaining input selection and cursor position.
 * @param {React.InputHTMLAttributes<HTMLInputElement> & { id: string, label?: string, error?: string }} props
 */
export default function PasswordInput({
  id,
  label = 'Password',
  value,
  onChange,
  error,
  placeholder = '••••••••',
  required = true,
  autoComplete = 'current-password',
  className = '',
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  const toggleVisibility = () => {
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      setShowPassword((prev) => !prev);
      // Restore cursor position on next tick
      requestAnimationFrame(() => {
        input.setSelectionRange(start, end);
        input.focus();
      });
    } else {
      setShowPassword((prev) => !prev);
    }
  };

  return (
    <div className={`field ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="pr-10"
          {...rest}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
          tabIndex={0}
          className="absolute right-3 p-1 text-text-3 hover:text-white transition rounded focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
