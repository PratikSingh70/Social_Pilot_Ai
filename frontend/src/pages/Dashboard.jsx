import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { StatSkeleton, ChartSkeleton, PostSkeleton } from '../components/Skeleton';
import { Sparkles, PenSquare, Calendar, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumRes, postsRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/posts'),
        ]);
        setSummary(sumRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = [
    { label: 'Total reach', value: summary?.reach ? `${(summary.reach / 1000).toFixed(1)}K` : '24.5K', delta: `+${summary?.trends?.reach || 18.2}%` },
    { label: 'Engagement', value: summary?.engagement ? `${summary.engagement}%` : '8.4%', delta: `+${summary?.trends?.engagement || 4.7}%` },
    { label: 'Scheduled', value: posts.filter((p) => p.status === 'scheduled').length || 16, delta: '4 today' },
    { label: 'AI content', value: `${summary?.ai_content || 67}%`, delta: `+${summary?.trends?.ai || 23.1}%` },
  ];

  const chartData = summary?.chart || [
    { d: 'M', v: 30 },
    { d: 'T', v: 52 },
    { d: 'W', v: 41 },
    { d: 'T', v: 76 },
    { d: 'F', v: 68 },
    { d: 'S', v: 92 },
    { d: 'S', v: 78 },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          stats.map((card) => (
            <div key={card.label} className="card flex flex-col justify-between">
              <div className="text-[11px] uppercase tracking-[0.2em] text-text-3 font-semibold">{card.label}</div>
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

      {/* Chart and Quick Actions */}
      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        {loading ? (
          <ChartSkeleton />
        ) : (
          <div className="card chart-container">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-white">Audience Growth & Reach</h2>
                <p className="text-xs text-text-3 mt-0.5">Weekly cross-channel interaction volume</p>
              </div>
              <span className="text-xs text-text-2 bg-white/5 px-2.5 py-1 rounded-lg border border-white/[0.06]">
                Last 7 days
              </span>
            </div>
            <div className="flex h-52 items-end gap-3 pt-4">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex flex-1 flex-col items-center gap-2 h-full justify-end">
                  <div
                    className="w-full rounded-t-xl bg-ai/85 hover:bg-ai transition-all duration-300"
                    style={{ height: `${item.v}%` }}
                    title={`${item.v}% volume on ${item.d}`}
                  />
                  <span className="text-[10px] uppercase font-semibold text-text-3">{item.d}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card flex flex-col justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-white">Quick Actions</h2>
            <p className="text-xs text-text-3 mt-0.5">Jump directly into high-leverage workflows</p>
          </div>
          <div className="mt-5 space-y-3">
            <Link
              to="/app/ai-studio"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-xs sm:text-sm text-text-2 hover:border-accent/40 hover:text-white transition"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent grid place-items-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">Generate AI Post Ideas</div>
                <div className="text-[11px] text-text-3">Craft viral hooks in seconds</div>
              </div>
            </Link>

            <Link
              to="/app/create"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-xs sm:text-sm text-text-2 hover:border-accent/40 hover:text-white transition"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan/15 text-cyan grid place-items-center shrink-0">
                <PenSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">Create New Post</div>
                <div className="text-[11px] text-text-3">Compose and schedule drop</div>
              </div>
            </Link>

            <Link
              to="/app/calendar"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-xs sm:text-sm text-text-2 hover:border-accent/40 hover:text-white transition"
            >
              <div className="w-8 h-8 rounded-lg bg-success/15 text-success grid place-items-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">View Content Calendar</div>
                <div className="text-[11px] text-text-3">Inspect weekly schedule</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="card">
        <div className="mb-4 flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <h2 className="text-sm sm:text-base font-semibold text-white">Recent Posts</h2>
          <Link to="/app/library" className="text-xs text-accent hover:underline font-medium">
            View full library →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-3">
            {posts.slice(0, 4).map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition"
              >
                <div className="min-w-0 pr-4">
                  <div className="font-medium text-white text-xs sm:text-sm truncate">{post.title}</div>
                  <div className="mt-1 text-[11px] text-text-3 capitalize">
                    {post.platform} • {post.scheduled_at ? new Date(post.scheduled_at).toLocaleDateString() : 'Draft'}
                  </div>
                </div>
                <span className="post-badge badge-scheduled shrink-0">
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-3 text-center py-6">No recent posts found.</p>
        )}
      </section>
    </div>
  );
}
