import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useToast } from '../components/Toast';
import CopyButton from '../components/CopyButton';
import { FormSuccess, FormErrorSummary, FieldError } from '../components/FormFeedback';
import { ButtonSpinner } from '../components/Skeleton';
import { Sparkles, Send, RefreshCw, FolderPlus } from 'lucide-react';

const TEMPLATES = [
  {
    label: 'Instagram carousel',
    platform: 'instagram',
    tone: 'bold',
    goal: 'engagement',
    prompt: 'Create a 5-slide educational carousel about productivity hacks for solo founders.',
  },
  {
    label: 'LinkedIn thought leadership',
    platform: 'linkedin',
    tone: 'professional',
    goal: 'authority',
    prompt: 'Share a personal perspective on how AI tools are reshaping data analysis workflows in 2025.',
  },
  {
    label: 'X viral thread',
    platform: 'x',
    tone: 'bold',
    goal: 'reach',
    prompt: 'Write a punchy 4-tweet thread breaking down the modern AI tech stack.',
  },
];

export default function AIStudio() {
  const [prompt, setPrompt] = useState('Create a short post about AI workflows for founders.');
  const [platform, setPlatform] = useState('instagram');
  const [tone, setTone] = useState('professional');
  const [content, setContent] = useState(
    'AI is not replacing great operators.\n\nIt is helping them move faster, decide better, and ship with more clarity.\n\nThree shifts in 2025:\n• Analysts who prompt better ship faster\n• Reports become interactive conversations\n• Judgment is the new moat\n\n#DataAnalytics #AI #Productivity'
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const { show } = useToast();
  const nav = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrors({ prompt: 'Please describe your content idea or prompt.' });
      document.getElementById('prompt')?.focus();
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const res = await api.post('/ai/generate', {
        prompt,
        platform,
        tone,
        content_type: 'social_post',
      });
      setContent(res.data.content);
      show('New draft generated with AI!', 'ai');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to generate AI content.';
      setErrors({ form: msg });
      show(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDrafts = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await api.post('/posts', {
        platform,
        title: prompt.slice(0, 50) || 'AI Draft',
        content,
        scheduled_at: null,
      });
      setSuccess('Draft successfully saved to your Content Library!');
      show('Draft saved to library!', 'success');
    } catch (err) {
      show('Failed to save draft.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishNow = () => {
    nav('/app/create', { state: { content, platform } });
  };

  const applyTemplate = (t) => {
    setPrompt(t.prompt);
    setPlatform(t.platform);
    setTone(t.tone);
    show(`Template applied: ${t.label}`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">AI Studio</h1>
          <p className="text-xs text-text-2 mt-0.5">Generate high-converting social copy tuned for each algorithm.</p>
        </div>
      </div>

      <FormErrorSummary errors={errors} />
      <FormSuccess message={success} />

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        {/* Left prompt configuration card */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-white">Generation Parameters</h2>
          </div>

          <div className="field">
            <label htmlFor="prompt">Content Idea / Topic</label>
            <textarea
              id="prompt"
              rows={5}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (errors.prompt) setErrors((prev) => ({ ...prev, prompt: undefined }));
              }}
              placeholder="What would you like to post about today?"
              aria-invalid={Boolean(errors.prompt)}
              aria-describedby={errors.prompt ? 'prompt-error' : undefined}
            />
            <FieldError id="prompt" message={errors.prompt} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="field">
              <label htmlFor="ai-platform">Platform</label>
              <select
                id="ai-platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="x">X (Twitter)</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="ai-tone">Tone</label>
              <select
                id="ai-tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="professional">Professional</option>
                <option value="bold">Bold & Direct</option>
                <option value="casual">Casual & Story</option>
                <option value="witty">Witty</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleGenerate}
            className="btn btn-ai w-full h-10 text-xs font-semibold mt-2"
          >
            {loading ? <ButtonSpinner label="Generating with AI…" /> : <span className="inline-flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Generate content</span>}
          </button>
        </div>

        {/* Right generated preview card */}
        <div className="card flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white">Generated Draft</h2>
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-[#d9c9ff] border border-accent/20">
                  Ready to publish
                </span>
              </div>
              <CopyButton text={content} label="Copy draft" />
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#101319] p-4 min-h-[220px]">
              <pre className="whitespace-pre-wrap text-xs sm:text-sm font-sans leading-relaxed text-text-2 select-text">
                {content}
              </pre>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handlePublishNow}
              className="btn btn-primary h-9 px-4 text-xs font-semibold"
            >
              <Send className="w-3.5 h-3.5 mr-1" /> Use in composer
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleGenerate}
              className="btn btn-outline h-9 px-3 text-xs"
              title="Regenerate another angle"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Rewrite
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={handleSaveToDrafts}
              className="btn btn-ghost h-9 px-3 text-xs text-text-2 hover:text-white"
            >
              <FolderPlus className="w-3.5 h-3.5 mr-1" /> Save to library
            </button>
          </div>
        </div>
      </section>

      {/* Suggested Templates */}
      <section className="card">
        <h2 className="text-sm font-semibold text-white">One-Click Templates</h2>
        <p className="text-xs text-text-3 mt-0.5">Click any template below to preload proven prompt structures.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {TEMPLATES.map((template) => (
            <button
              key={template.label}
              type="button"
              onClick={() => applyTemplate(template)}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left hover:border-accent/40 hover:bg-white/[0.05] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="text-xs font-semibold text-white flex items-center justify-between">
                <span>{template.label}</span>
                <span className="text-[10px] text-accent uppercase tracking-wider">{template.platform}</span>
              </div>
              <p className="mt-2 text-xs text-text-3 line-clamp-2">{template.prompt}</p>
              <div className="mt-3 text-[10px] uppercase tracking-[0.15em] text-text-3">
                {template.tone} • {template.goal}
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
