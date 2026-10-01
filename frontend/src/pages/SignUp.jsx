import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import PasswordInput from '../components/PasswordInput';
import { FormSuccess, FormErrorSummary, FieldError } from '../components/FormFeedback';
import { ButtonSpinner } from '../components/Skeleton';
import { trackAttributionEvent } from '../lib/utm';
import { Sparkles, ArrowLeft, Check } from 'lucide-react';

export default function SignUp() {
  const { register, loading } = useAuth();
  const { show } = useToast();
  const nav = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required.';
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (password !== confirm) {
      errs.confirm = 'Passwords do not match.';
    }
    if (!agreed) {
      errs.agreed = 'You must agree to the Terms of Service and Privacy Policy.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstKey = Object.keys(validationErrors)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }

    setErrors({});
    try {
      await register(name, email, password);

      // Track marketing attribution event without PII
      trackAttributionEvent('user_signup', { plan: 'pro_trial' });

      setSuccessMessage('Account created successfully! Redirecting to dashboard…');
      show('Account created! Welcome to SocialPilot AI.', 'success');
      setPassword('');
      setConfirm('');
      setTimeout(() => {
        nav('/app/dashboard');
      }, 700);
    } catch (err) {
      const detail = err.response?.data?.detail || 'Sign up failed. Try a different email address.';
      setErrors({ form: detail });
      show(detail, 'error');
    }
  };

  return (
    <div className="grid lg:grid-cols-2 min-h-screen bg-bg text-white">
      {/* Left visual */}
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
            Start creating in minutes.
          </h1>
          <p className="mt-4 text-text-2 text-sm leading-relaxed max-w-md">
            Join 50,000+ creators using AI to plan, write, and publish social content on autopilot.
          </p>
          <ul className="mt-6 space-y-2.5 text-xs sm:text-sm text-text-2">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success shrink-0" /> Free 14-day trial — no credit card required
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success shrink-0" /> Unlimited AI-generated draft variations
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success shrink-0" /> Auto-schedule across Instagram, LinkedIn, X, and Facebook
            </li>
          </ul>
        </div>
      </div>

      {/* Right form */}
      <div className="grid place-items-center p-6 sm:p-12 bg-bg-2">
        <div className="w-full max-w-[420px]">
          <h2 className="text-2xl font-semibold tracking-tight">Create your account</h2>
          <p className="text-text-2 text-xs sm:text-sm mt-1.5">Start your 14-day free trial</p>

          <form onSubmit={handleSubmit} noValidate className="mt-6">
            <FormErrorSummary errors={errors} />
            <FormSuccess message={successMessage} className="mb-4" />

            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Alex Morgan"
                required
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              <FieldError id="name" message={errors.name} />
            </div>

            <div className="field mt-4">
              <label htmlFor="email">Email</label>
              <input
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
              placeholder="At least 6 characters"
              required
            />

            <PasswordInput
              id="confirm"
              label="Confirm password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                if (errors.confirm) setErrors((prev) => ({ ...prev, confirm: undefined }));
              }}
              error={errors.confirm}
              className="mt-4"
              placeholder="Re-enter your password"
              required
            />

            <div className="mt-4">
              <label className="flex items-start gap-2 text-xs text-text-2 cursor-pointer select-none">
                <input
                  id="agreed"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (errors.agreed) setErrors((prev) => ({ ...prev, agreed: undefined }));
                  }}
                  className="accent-accent w-4 h-4 mt-0.5 rounded"
                  aria-invalid={Boolean(errors.agreed)}
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="text-accent hover:underline font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-accent hover:underline font-medium">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              <FieldError id="agreed" message={errors.agreed} />
            </div>

            <button type="submit" disabled={loading} className="btn btn-ai w-full mt-6 h-11 text-sm font-semibold">
              {loading ? <ButtonSpinner label="Creating account…" /> : 'Create account →'}
            </button>
          </form>

          <p className="text-center mt-6 text-xs text-text-2">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-medium hover:underline">
              Sign in
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