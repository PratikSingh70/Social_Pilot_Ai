import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, FileText, Calendar, Clock, X } from 'lucide-react';

const SEARCHABLE_ITEMS = [
  { id: '1', title: '5 AI tools every student should know', type: 'scheduled', platform: 'instagram', link: '/app/library' },
  { id: '2', title: 'How AI is changing data analytics', type: 'published', platform: 'linkedin', link: '/app/library' },
  { id: '3', title: 'Thread: The AI stack for solo founders', type: 'draft', platform: 'x', link: '/app/library' },
  { id: '4', title: 'AI workflow starter pack', type: 'draft', platform: 'instagram', link: '/app/library' },
  { id: '5', title: '3 ways founders use AI for speed', type: 'ai-draft', platform: 'linkedin', link: '/app/ai-studio' },
  { id: '6', title: 'The productivity trap in 2025', type: 'scheduled', platform: 'x', link: '/app/calendar' },
];

/**
 * GlobalSearch component adhering to W3C ARIA 1.2 Combobox pattern
 */
export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const listboxRef = useRef(null);
  const navigate = useNavigate();

  // Keyboard shortcut '/' focuses the input unless already inside an editable element
  useEffect(() => {
    const handleGlobalSlash = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isEditable = document.activeElement?.isContentEditable;
      if (e.key === '/' && activeTag !== 'input' && activeTag !== 'textarea' && !isEditable) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalSlash);
    return () => window.removeEventListener('keydown', handleGlobalSlash);
  }, []);

  // 300ms Debounce search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }

    const timer = setTimeout(() => {
      const lower = query.toLowerCase();
      const matches = SEARCHABLE_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(lower) ||
          item.platform.toLowerCase().includes(lower) ||
          item.type.toLowerCase().includes(lower)
      );
      setResults(matches);
      setIsOpen(true);
      setActiveIndex(-1);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!inputRef.current?.contains(e.target) && !listboxRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
      return;
    }

    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        navigate(results[activeIndex].link);
        setIsOpen(false);
      } else if (query.trim()) {
        navigate(`/app/search?q=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
      }
    }
  };

  const handleSelect = (item) => {
    navigate(item.link);
    setIsOpen(false);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ai-draft':
        return <Sparkles className="w-3.5 h-3.5 text-accent" />;
      case 'scheduled':
        return <Calendar className="w-3.5 h-3.5 text-cyan" />;
      case 'published':
        return <Clock className="w-3.5 h-3.5 text-success" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-text-3" />;
    }
  };

  return (
    <div className="relative w-48 sm:w-64 md:w-80">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-text-3 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search posts, drafts... (Press /)"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="global-search-listbox"
          aria-activedescendant={activeIndex >= 0 ? `search-item-${activeIndex}` : undefined}
          className="w-full h-9 pl-9 pr-8 text-xs bg-card/80 border border-white/[0.08] rounded-xl text-white placeholder:text-text-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            aria-label="Clear search input"
            className="absolute right-2.5 text-text-3 hover:text-white p-0.5 rounded transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-block absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono text-text-3 bg-white/5 border border-white/10 rounded">
            /
          </kbd>
        )}
      </div>

      {isOpen && query.trim() && (
        <ul
          id="global-search-listbox"
          ref={listboxRef}
          role="listbox"
          aria-label="Search suggestions"
          className="absolute left-0 right-0 top-full mt-1.5 py-1.5 bg-card border border-border rounded-xl shadow-glow z-50 max-h-72 overflow-y-auto"
        >
          {results.length > 0 ? (
            <>
              {results.map((item, idx) => (
                <li
                  key={item.id}
                  id={`search-item-${idx}`}
                  role="option"
                  aria-selected={activeIndex === idx}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    activeIndex === idx ? 'bg-accent/20 text-white' : 'text-text-2 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {getTypeIcon(item.type)}
                    <span className="truncate">{item.title}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-text-3 shrink-0 ml-2">
                    {item.platform}
                  </span>
                </li>
              ))}
              <li
                onClick={() => {
                  navigate(`/app/search?q=${encodeURIComponent(query.trim())}`);
                  setIsOpen(false);
                }}
                className="px-3 py-2 text-xs text-accent hover:text-white cursor-pointer border-t border-white/[0.06] text-center font-medium"
              >
                View all results for "{query}" →
              </li>
            </>
          ) : (
            <li className="px-3 py-4 text-xs text-center text-text-3">
              No matching content found for "{query}"
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
