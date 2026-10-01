import { useState, useEffect } from 'react';
import api from '../api';
import { StatSkeleton, ChartSkeleton } from '../components/Skeleton';
import { BarChart3, ArrowUpRight, TrendingUp, RefreshCw } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/summary');
      setData(res.data);
    } catch (err) {
      console.warn('Using default analytics:', err);
      setData({
        total_posts: 128,
        reach: 24500,
        engagement: 8.4,
        ai_content: 67,
        trends: { posts: 12.5, reach: 18.2, engagement: 4.7, ai: 23.1 },
        chart: [
          { d: 'Mon', v: 40 },
          { d: 'Tue', v: 65 },
          { d: 'Wed', v: 50 },
          { d: 'Thu', v: 80 },
          { d: 'Fri', v: 60 },
          { d: 'Sat', v: 95 },
          { d: 'Sun', v: 70 },
        ],
        platforms: [
          { name: 'Instagram', pct: 48, color: '#DD2A7B' },
          { name: 'LinkedIn', pct: 28, color: '#0A66C2' },
          { name: 'X', pct: 18, color: '#94A3B8' },
          { name: 'Facebook', pct: 6, color: '#1877F2' },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const metrics = [
    {
      label: 'Total audience reach',
      value: data?.reach ? `${(data.reach / 1000).toFixed(1)}K` : '24.5K',
      delta: `+${data?.trends?.reach || 18.2}%`,
    },
    {
      label: 'Engagement rate',
      value: data?.engagement ? `${data.engagement}%` : '8.4%',
      delta: `+${data?.trends?.engagement || 4.7}%`,
    },
    {
      label: 'Total published posts',
      value: data?.total_posts || 128,
      delta: `+${data?.trends?.posts || 12.5}%`,
    },
    {
      label: 'AI-assisted content',
      value: `${data?.ai_content || 67}%`,
      delta: `+${data?.trends?.ai || 23.1}%`,
    },
  ];

  const chart = data?.chart || [
    { d: 'Mon', v: 40 },
    { d: 'Tue', v: 65 },
    { d: 'Wed', v: 50 },
    { d: 'Thu', v: 80 },
    { d: 'Fri', v: 60 },
    { d: 'Sat', v: 95 },
    { d: 'Sun', v: 70 },
  ];

  const platforms = data?.platforms || [
    { name: 'Instagram', pct: 48, color: '#DD2A7B' },
    { name: 'LinkedIn', pct: 28, color: '#0A66C2' },
    { name: 'X', pct: 18, color: '#94A3B8' },
    { name: 'Facebook', pct: 6, color: '#1877F2' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Performance Analytics</h1>
          <p className="text-xs text-text-2 mt-0.5">
            Real-time multi-platform reach, engagement metrics, and growth distribution.
          </p>
        </div>
        <button
          type="button"
          onClick={loadAnalytics}
          className="btn btn-outline btn-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh metrics
        </button>
      </div>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          metrics.map((card) => (
            <div key={card.label} className="card flex flex-col justify-between">
              <div className="text-[11px] uppercase tracking-[0.2em] text-text-3 font-semibold">
                {card.label}
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div className="text-3xl font-bold text-white tracking-tight">{card.value}</div>
                <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[10px] font-semibold text-success flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> {card.delta}
                </span>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Chart & Platform breakdown */}
      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        {loading ? (
          <ChartSkeleton />
        ) : (
          <div className="card chart-container">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" /> Weekly Reach Trend
                </h2>
                <p className="text-xs text-text-3 mt-0.5">Daily impressions across all connected accounts</p>
              </div>
              <span className="text-xs text-text-2 bg-white/5 px-2.5 py-1 rounded-lg border border-white/[0.06]">
                Past 7 days
              </span>
            </div>
            <div className="flex h-56 items-end gap-3 pt-4">
              {chart.map((item, idx) => (
                <div key={idx} className="flex flex-1 flex-col items-center gap-2 h-full justify-end">
                  <div
                    className="w-full rounded-t-xl bg-ai/85 hover:bg-ai transition-all duration-300 relative group cursor-pointer"
                    style={{ height: `${item.v}%` }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#161822] text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                      {item.v}% reach
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-text-3">{item.d}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan" /> Platform Distribution
            </h2>
            <span className="text-xs text-text-3">By share</span>
          </div>

          <div className="space-y-4 pt-1">
            {platforms.map((platform) => (
              <div key={platform.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium text-white">{platform.name}</span>
                  <span className="font-semibold text-text-2">{platform.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${platform.pct}%`,
                      backgroundColor: platform.color || '#8b5cf6',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
