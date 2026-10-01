import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import CopyButton from '../components/CopyButton';
import ConfirmModal from '../components/ConfirmModal';
import { FormSuccess, FormErrorSummary } from '../components/FormFeedback';
import { appendUtmToUrl } from '../lib/utm';
import { Save, Trash2, User, Sliders, Share2 } from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuth();
  const { show } = useToast();

  const [name, setName] = useState(user?.name || 'Alex Morgan');
  const [email] = useState(user?.email || 'alex@socialpilot.ai');
  const [plan] = useState(user?.plan || 'Pro');
  const [autoSchedule, setAutoSchedule] = useState(true);
  const [weeklyRecap, setWeeklyRecap] = useState(true);
  const [crossPublish, setCrossPublish] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [success, setSuccess] = useState('');
  const deleteBtnRef = useRef(null);

  const inviteLink = appendUtmToUrl(`${window.location.origin}/signup?ref=${user?.id || 'demo'}`);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSuccess('Settings updated successfully.');
    show('Settings saved!', 'success');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    show('Account scheduled for deletion.', 'info');
    logout();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-white">Account Settings</h1>
        <p className="text-xs text-text-2 mt-0.5">Manage your profile, team defaults, automation rules, and referrals.</p>
      </div>

      <FormSuccess message={success} />

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Profile Card */}
        <section className="card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <User className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-white">Profile Details</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="settings-name">Full Name</label>
              <input
                id="settings-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="settings-email">Email Address</label>
              <input
                id="settings-email"
                value={email}
                disabled
                className="opacity-60 cursor-not-allowed"
              />
            </div>
            <div className="field">
              <label htmlFor="settings-plan">Current Plan</label>
              <input
                id="settings-plan"
                value={`${plan} Plan (14-day trial active)`}
                disabled
                className="opacity-60 cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        {/* Automation Rules */}
        <section className="card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <Sliders className="w-4 h-4 text-cyan" />
            <h2 className="text-sm font-semibold text-white">Automation Preferences</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-text-2">
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] transition">
              <div>
                <div className="font-medium text-white">Auto-schedule AI drafts</div>
                <div className="text-xs text-text-3">Automatically assign recommended high-engagement slots</div>
              </div>
              <input
                type="checkbox"
                checked={autoSchedule}
                onChange={(e) => setAutoSchedule(e.target.checked)}
                className="accent-accent w-4 h-4 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] transition">
              <div>
                <div className="font-medium text-white">Weekly performance recap email</div>
                <div className="text-xs text-text-3">Receive weekly AI summaries of reach and growth momentum</div>
              </div>
              <input
                type="checkbox"
                checked={weeklyRecap}
                onChange={(e) => setWeeklyRecap(e.target.checked)}
                className="accent-accent w-4 h-4 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] transition">
              <div>
                <div className="font-medium text-white">Cross-platform formatting sync</div>
                <div className="text-xs text-text-3">Automatically adapt hashtags and character counts per network</div>
              </div>
              <input
                type="checkbox"
                checked={crossPublish}
                onChange={(e) => setCrossPublish(e.target.checked)}
                className="accent-accent w-4 h-4 rounded"
              />
            </label>
          </div>
        </section>

        {/* Invite / Referral Section (Feature 9 CopyButton) */}
        <section className="card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <Share2 className="w-4 h-4 text-success" />
            <h2 className="text-sm font-semibold text-white">Invite Collaborators & Referral Link</h2>
          </div>
          <p className="text-xs text-text-2">
            Share this link with your teammates or audience. UTM marketing parameters are automatically attached.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-text-2 focus:outline-none"
            />
            <CopyButton text={inviteLink} label="Copy invite link" />
          </div>
        </section>

        {/* Submit action */}
        <div className="flex items-center justify-between pt-2">
          <button type="submit" className="btn btn-primary h-10 px-5 text-xs font-semibold">
            <Save className="w-3.5 h-3.5 mr-1.5" /> Save changes
          </button>

          <button
            ref={deleteBtnRef}
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-ghost text-xs text-error hover:bg-error/10 hover:text-error"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete account
          </button>
        </div>
      </form>

      {/* Account Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete your account permanently?"
        message="This action is irreversible. All your connected social channels, scheduled posts, and historical analytics will be immediately deleted."
        confirmLabel="Yes, delete account"
        cancelLabel="Keep account"
        isDanger={true}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
        triggerRef={deleteBtnRef}
      />
    </div>
  );
}
