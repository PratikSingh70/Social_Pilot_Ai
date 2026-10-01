/**
 * Content publication and update timestamps for legal, policy, and help documents.
 */
export const CONTENT_DATES = {
  privacy: {
    iso: '2025-09-30',
    formatted: 'September 30, 2025',
  },
  terms: {
    iso: '2025-09-30',
    formatted: 'September 30, 2025',
  },
  cookies: {
    iso: '2025-09-30',
    formatted: 'September 30, 2025',
  },
  faq: {
    iso: '2025-09-30',
    formatted: 'September 30, 2025',
  },
};

/**
 * LastUpdated component with semantic <time> tag.
 * @param {{ pageKey: keyof typeof CONTENT_DATES, className?: string }} props
 */
export function LastUpdated({ pageKey, className = '' }) {
  const item = CONTENT_DATES[pageKey] || CONTENT_DATES.privacy;
  return (
    <p className={`text-xs text-text-3 ${className}`}>
      Last updated: <time dateTime={item.iso} className="text-text-2 font-medium">{item.formatted}</time>
    </p>
  );
}
