import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import PasswordInput from '../components/PasswordInput';
import { FormSuccess, FormErrorSummary, FieldError } from '../components/FormFeedback';
import { ButtonSpinner } from '../components/Skeleton';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function Login() {
  const { login, loading } = useAuth();
  const { show } = useToast();
  const nav = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const emailInputRef = useRef(null);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus first invalid field
      const firstKey = Object.keys(validationErrors)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }

    setErrors({});
    try {
      await login(email, password);
      setSuccessMessage('Login successful! Redirecting to your workspace…');
      show('Welcome back!', 'success');
      setPassword('');
      setTimeout(() => {
        nav('/app/dashboard');
      }, 700);
    } catch (err) {
      const detail = err.response?.data?.detail || 'Incorrect email or password.';
      setErrors({ form: detail });
      show(detail, 'error');
    }
  };

  return (
    <div className="grid lg:grid-cols-2 min-h-screen bg-bg text-white">
      {/* ---------- Left visual ---------- */}
      <div
        className="hidden lg:flex flex-col justify-center gap-8 px-16 py-16 relative overflow-hidden
                   bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,.25),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,.18),transparent_55%),#08090D]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-ai grid place-items-center shadow-ai text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-base font-semibold">SocialPilot AI</span>
        </div>

        <div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] bg-gradient-to-b from-white to-[#c4c4cc] bg-clip-text text-transparent">
            Your social media, powered by AI.
          </h1>
          <p className="mt-4 text-text-2 text-sm leading-relaxed max-w-md">
            Create better content, automate your schedule, and grow your audience from one intelligent workspace.
          </p>
        </div>
      </div>

      {/* ---------- Right form ---------- */}
      <div className="grid place-items-center p-6 sm:p-12 bg-bg-2">
        <div className="w-full max-w-[400px]">
          <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
          <p className="text-text-2 text-xs sm:text-sm mt-1.5">Sign in to your workspace</p>

          <div className="mt-4 p-3 rounded-xl border border-accent/20 bg-accent/5 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-accent">Demo Account:</span>{' '}
              <span className="text-text-2">alex@socialpilot.ai</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('alex@socialpilot.ai');
                setPassword('password123');
                setErrors({});
              }}
              className="text-accent underline hover:text-white font-medium"
            >
              Auto-fill
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-4">
            <FormErrorSummary errors={errors} />
            <FormSuccess message={successMessage} className="mb-4" />

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                ref={emailInputRef}
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="you@example.com"
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              <FieldError id="email" message={errors.email} />
            </div>

            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              className="mt-4"
              required
            />

            <div className="flex justify-between items-center mt-3.5 text-xs">
              <label className="flex items-center gap-2 text-text-2 cursor-pointer select-none">
                <input type="checkbox" defaultChecked className="accent-accent w-3.5 h-3.5 rounded" />
                Remember me
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); show('Password reset instructions sent if email exists.', 'info'); }} className="text-accent hover:underline">
                Forgot password?
              </a>
            </div>

            <button type="submit" disabled={loading} className="btn btn-ai w-full mt-6 h-11 text-sm font-semibold">
              {loading ? <ButtonSpinner label="Signing in…" /> : 'Sign in →'}
            </button>
          </form>

          <p className="text-center mt-6 text-xs text-text-2">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent font-medium hover:underline">
              Create one
            </Link>
          </p>

          <p className="text-center mt-3 text-xs text-text-2">
            <Link to="/" className="inline-flex items-center gap-1 text-text-3 hover:text-white transition">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}