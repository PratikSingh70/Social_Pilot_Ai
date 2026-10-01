import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { CalendarCellSkeleton } from '../components/Skeleton';
import { CalendarDays, Plus, Clock } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/posts');
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Content Calendar</h1>
          <p className="text-xs text-text-2 mt-0.5">Visualize publishing cadences and upcoming social drop dates.</p>
        </div>
        <Link to="/app/create" className="btn btn-primary btn-sm">
          <Plus className="w-3.5 h-3.5 mr-1" /> New event
        </Link>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <CalendarDays className="w-4 h-4 text-accent" />
            <span>Weekly Schedule</span>
          </div>
          <span className="text-xs text-text-3">Auto-syncs hourly</span>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {DAYS.map((d) => (
              <CalendarCellSkeleton key={d} />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {DAYS.map((day, idx) => {
              const dayPosts = posts.filter((_, i) => i % 7 === idx);
              return (
                <div
                  key={day}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 flex flex-col justify-between min-h-[140px] hover:border-accent/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-3">{day}</span>
                    <span className="w-2 h-2 rounded-full bg-accent/30" />
                  </div>

                  <div className="space-y-2 my-2">
                    {dayPosts.length > 0 ? (
                      dayPosts.map((p) => (
                        <div key={p.id} className="p-2 rounded-xl bg-card border border-white/[0.06] text-xs">
                          <div className="font-medium text-white truncate text-[11px]">{p.title}</div>
                          <div className="flex items-center gap-1 text-[10px] text-text-3 mt-1 capitalize">
                            <Clock className="w-2.5 h-2.5" /> {p.platform}
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-[11px] text-text-3 italic">No drops scheduled</span>
                    )}
                  </div>

                  <Link
                    to="/app/create"
                    className="text-[10px] font-semibold text-accent hover:underline inline-flex items-center gap-1 mt-auto"
                  >
                    + Add slot
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
