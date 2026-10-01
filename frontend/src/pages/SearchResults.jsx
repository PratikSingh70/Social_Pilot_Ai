import { useSearchParams, Link } from 'react-router-dom';
import { Search, Sparkles, Calendar, Clock, FileText, ArrowLeft } from 'lucide-react';

const SEARCHABLE_ITEMS = [
  { id: '1', title: '5 AI tools every student should know', type: 'scheduled', platform: 'Instagram', date: 'Sep 22, 2025', link: '/app/library' },
  { id: '2', title: 'How AI is changing data analytics', type: 'published', platform: 'LinkedIn', date: 'Sep 15, 2025', link: '/app/library' },
  { id: '3', title: 'Thread: The AI stack for solo founders', type: 'draft', platform: 'X', date: 'Sep 10, 2025', link: '/app/library' },
  { id: '4', title: 'AI workflow starter pack', type: 'draft', platform: 'Instagram', date: 'Aug 12, 2025', link: '/app/library' },
  { id: '5', title: '3 ways founders use AI for speed', type: 'ai-draft', platform: 'LinkedIn', date: 'Aug 16, 2025', link: '/app/ai-studio' },
  { id: '6', title: 'The productivity trap in 2025', type: 'scheduled', platform: 'X', date: 'Aug 18, 2025', link: '/app/calendar' },
];

/**
 * SearchResults page displayed when user searches from header or navigates to /app/search?q=...
 */
export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const lower = query.toLowerCase();

  const results = SEARCHABLE_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(lower) ||
      item.platform.toLowerCase().includes(lower) ||
      item.type.toLowerCase().includes(lower)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/app/dashboard" className="btn btn-ghost btn-sm text-text-2">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-white">Search Results</h1>
          <p className="text-xs text-text-3">
            Showing results for <span className="text-white font-medium">"{query}"</span> ({results.length} found)
          </p>
        </div>
      </div>

      <div className="card">
        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/5 grid place-items-center text-text-2">
                    {item.type === 'ai-draft' ? <Sparkles className="w-4 h-4 text-accent" /> : <FileText className="w-4 h-4 text-cyan" />}
                  </div>
                  <div>
                    <Link to={item.link} className="font-medium text-white hover:text-accent transition text-sm">
                      {item.title}
                    </Link>
                    <div className="text-xs text-text-3 mt-0.5">
                      {item.platform} • {item.date} • <span className="uppercase tracking-wider">{item.type}</span>
                    </div>
                  </div>
                </div>
                <Link to={item.link} className="btn btn-outline btn-sm">
                  Open
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-text-3">
            <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium text-text-2">No matching posts or content found</p>
            <p className="text-xs mt-1">Try searching for keywords like "AI", "LinkedIn", or "workflow".</p>
          </div>
        )}
      </div>
    </div>
  );
}
