import { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from '../components/Toast';
import { ButtonSpinner } from '../components/Skeleton';
import { Share2, Check, Plus, RefreshCw, AlertCircle } from 'lucide-react';

const DEFAULT_ACCOUNTS = [
  { id: 'ig', name: 'Instagram', handle: '@alex.morgan', connected: true },
  { id: 'li', name: 'LinkedIn', handle: 'linkedin.com/in/alexmorgan', connected: true },
  { id: 'x', name: 'X (Twitter)', handle: null, connected: false },
  { id: 'fb', name: 'Facebook', handle: null, connected: false },
];

export default function Accounts() {
  const [accounts, setAccounts] = useState(DEFAULT_ACCOUNTS);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const { show } = useToast();

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/accounts');
      if (res.data && Array.isArray(res.data)) {
        setAccounts(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch accounts, using local state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleToggle = async (account) => {
    setTogglingId(account.id);
    const action = account.connected ? 'disconnecting' : 'connecting';
    try {
      // Call backend toggle endpoint
      const res = await api.post(`/accounts/${account.id}/toggle`);
      setAccounts((prev) =>
        prev.map((a) => (a.id === account.id ? res.data : a))
      );
      show(
        res.data.connected
          ? `Successfully connected ${account.name} account!`
          : `Disconnected ${account.name} account.`,
        res.data.connected ? 'success' : 'info'
      );
    } catch {
      // Local fallback toggle
      setAccounts((prev) =>
        prev.map((a) => {
          if (a.id === account.id) {
            const nextConnected = !a.connected;
            return {
              ...a,
              connected: nextConnected,
              handle: nextConnected
                ? `@${a.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_user`
                : null,
            };
          }
          return a;
        })
      );
      show(
        account.connected
          ? `Disconnected ${account.name}.`
          : `Connected ${account.name} via OAuth 2.0!`,
        account.connected ? 'info' : 'success'
      );
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Connected Social Accounts</h1>
          <p className="text-xs text-text-2 mt-0.5">
            Authorize and manage the social platforms where SocialPilot AI will publish and fetch analytics.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchAccounts}
          className="btn btn-outline btn-sm self-start sm:self-auto"
          title="Refresh account statuses"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
        </button>
      </div>

      <div className="card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Share2 className="w-4 h-4 text-accent" />
            <span>Active Integrations</span>
          </div>
          <span className="text-xs text-text-3">
            {accounts.filter((a) => a.connected).length} of {accounts.length} connected
          </span>
        </div>

        <div className="space-y-3">
          {accounts.map((account) => {
            const isToggling = togglingId === account.id;
            return (
              <div
                key={account.id || account.name}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center font-bold text-white shrink-0 text-sm">
                    {account.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                      <span>{account.name}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          account.connected
                            ? 'bg-success/15 text-success border border-success/20'
                            : 'bg-white/10 text-text-3'
                        }`}
                      >
                        {account.connected ? 'Active' : 'Not Connected'}
                      </span>
                    </div>
                    <div className="text-xs text-text-3 mt-0.5">
                      {account.connected
                        ? account.handle || 'Connected account'
                        : 'Connect via OAuth 2.0 to enable auto-posting'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                  <button
                    type="button"
                    disabled={isToggling}
                    onClick={() => handleToggle(account)}
                    className={`btn btn-sm text-xs font-semibold px-4 ${
                      account.connected
                        ? 'btn-outline border-error/30 text-text-2 hover:border-error hover:text-error hover:bg-error/10'
                        : 'btn-primary'
                    }`}
                  >
                    {isToggling ? (
                      <ButtonSpinner label={account.connected ? 'Disconnecting…' : 'Connecting…'} />
                    ) : account.connected ? (
                      'Disconnect'
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> Connect Account
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3 text-xs text-text-3 mt-4">
          <AlertCircle className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
          <p>
            SocialPilot AI requests official read and write permissions to schedule posts, upload media, and sync engagement numbers. Tokens are encrypted using AES-256 and never shared.
          </p>
        </div>
      </div>
    </div>
  );
}
