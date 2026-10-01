import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useToast } from '../components/Toast';
import { FormSuccess, FormErrorSummary, FieldError } from '../components/FormFeedback';
import { ButtonSpinner } from '../components/Skeleton';
import ConfirmModal from '../components/ConfirmModal';
import { Send, Save, ArrowLeft } from 'lucide-react';

export default function CreatePost() {
  const [form, setForm] = useState({
    platform: 'instagram',
    title: '',
    content: '',
    scheduledAt: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const { show } = useToast();
  const nav = useNavigate();
  const discardTriggerRef = useRef(null);

  const isDirty = Boolean(form.title || form.content || form.scheduledAt);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Post title is required.';
    if (!form.content.trim()) errs.content = 'Post content is required.';
    return errs;
  };

  const handleSave = async (isScheduled) => {
    const errs = validate();
    if (isScheduled && !form.scheduledAt) {
      errs.scheduledAt = 'Please select a date and time to schedule this post.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const payload = {
        platform: form.platform,
        title: form.title,
        content: form.content,
        scheduled_at: isScheduled ? new Date(form.scheduledAt).toISOString() : null,
      };

      await api.post('/posts', payload);
      setSuccess(
        isScheduled
          ? 'Post scheduled successfully! Redirecting to calendar…'
          : 'Draft saved to library! Redirecting…'
      );
      show(isScheduled ? 'Post scheduled!' : 'Draft saved to library!', 'success');

      setTimeout(() => {
        nav(isScheduled ? '/app/calendar' : '/app/library');
      }, 700);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to save post.';
      setErrors({ form: msg });
      show(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateAway = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      nav('/app/dashboard');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <button
          ref={discardTriggerRef}
          type="button"
          onClick={handleNavigateAway}
          className="btn btn-ghost btn-sm text-text-2 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </button>
        <span className="text-xs text-text-3">All posts auto-saved locally</span>
      </div>

      <div className="card">
        <h1 className="text-xl font-semibold text-white">Create New Post</h1>
        <p className="text-xs text-text-2 mt-1">Compose, preview, and schedule content across your connected channels.</p>

        <form onSubmit={(e) => e.preventDefault()} noValidate className="mt-6 space-y-4">
          <FormErrorSummary errors={errors} />
          <FormSuccess message={success} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="platform">Target Platform</label>
              <select
                id="platform"
                name="platform"
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
              >
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="x">X (Twitter)</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="scheduledAt">Schedule Date & Time</label>
              <input
                id="scheduledAt"
                name="scheduledAt"
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => {
                  setForm({ ...form, scheduledAt: e.target.value });
                  if (errors.scheduledAt) setErrors((prev) => ({ ...prev, scheduledAt: undefined }));
                }}
                aria-invalid={Boolean(errors.scheduledAt)}
                aria-describedby={errors.scheduledAt ? 'scheduledAt-error' : undefined}
              />
              <FieldError id="scheduledAt" message={errors.scheduledAt} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="title">Campaign / Post Title</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g. 5 AI tools every student should know"
              required
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            <FieldError id="title" message={errors.title} />
          </div>

          <div className="field">
            <label htmlFor="content">Post Content</label>
            <textarea
              id="content"
              name="content"
              rows={6}
              value={form.content}
              onChange={(e) => {
                setForm({ ...form, content: e.target.value });
                if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
              }}
              placeholder="Write your post here or use AI Studio to generate hooks, value points, and hashtags…"
              required
              aria-invalid={Boolean(errors.content)}
              aria-describedby={errors.content ? 'content-error' : undefined}
            />
            <FieldError id="content" message={errors.content} />
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSave(true)}
              className="btn btn-primary h-10 px-5 text-xs font-semibold"
            >
              {loading ? <ButtonSpinner label="Scheduling…" /> : <span className="inline-flex items-center gap-1.5"><Send className="w-3.5 h-3.5" /> Schedule post</span>}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSave(false)}
              className="btn btn-outline h-10 px-4 text-xs"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save draft
            </button>
          </div>
        </form>
      </div>

      {/* Discard confirmation modal */}
      <ConfirmModal
        isOpen={showDiscardModal}
        title="Discard unsaved changes?"
        message="You have unsaved changes in this post draft. Leaving this page will permanently lose your modifications."
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
        isDanger={true}
        onConfirm={() => {
          setShowDiscardModal(false);
          nav('/app/dashboard');
        }}
        onCancel={() => setShowDiscardModal(false)}
        triggerRef={discardTriggerRef}
      />
    </div>
  );
}
