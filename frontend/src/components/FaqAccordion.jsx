import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * FAQ item definition
 * @typedef {{ id: string, question: string, answer: string, category: string }} FaqItem
 */

/**
 * Accessible FAQ Accordion component with aria-expanded, smooth height transitions,
 * and keyboard navigation support.
 * @param {{ items: FaqItem[], allowMultiple?: boolean }} props
 */
export default function FaqAccordion({ items, allowMultiple = true }) {
  const [openIds, setOpenIds] = useState(new Set(['faq-1']));

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-3" role="region" aria-label="Frequently Asked Questions">
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div
            key={item.id}
            className={`rounded-2xl border transition-all duration-200 ${
              isOpen
                ? 'bg-card border-accent/30 shadow-sm'
                : 'bg-card/50 border-white/[0.06] hover:border-white/[0.12]'
            }`}
          >
            <h3>
              <button
                type="button"
                id={`faq-btn-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`faq-content-${item.id}`}
                onClick={() => toggle(item.id)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-medium text-sm text-white focus-visible:ring-2 focus-visible:ring-accent rounded-2xl"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-text-3 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
                    isOpen ? 'rotate-180 text-accent' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </h3>

            <div
              id={`faq-content-${item.id}`}
              role="region"
              aria-labelledby={`faq-btn-${item.id}`}
              hidden={!isOpen}
              className={`px-5 pb-5 pt-1 text-xs sm:text-sm text-text-2 leading-relaxed transition-all duration-200 ${
                isOpen ? 'block' : 'hidden'
              }`}
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
