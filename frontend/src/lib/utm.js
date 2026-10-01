/**
 * UTM tracking helper utilities for capturing marketing parameters
 * without storing any PII.
 */

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const STORAGE_KEY = 'sp_utm';

/**
 * Parses query params from current URL and persists any UTM parameters into sessionStorage.
 */
export function captureUtmParameters() {
  if (typeof window === 'undefined') return;

  try {
    const params = new URLSearchParams(window.location.search);
    const utm = {};
    let hasUtm = false;

    UTM_KEYS.forEach((key) => {
      const val = params.get(key);
      if (val) {
        utm[key] = encodeURIComponent(val.slice(0, 100)); // sanitize length
        hasUtm = true;
      }
    });

    if (hasUtm) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
    }
  } catch (err) {
    console.warn('Unable to persist UTM parameters', err);
  }
}

/**
 * Returns captured UTM parameters object.
 * @returns {Record<string, string>}
 */
export function getStoredUtm() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Attaches captured UTM parameters to any outbound or invite link.
 * @param {string} url
 * @returns {string}
 */
export function appendUtmToUrl(url) {
  const utm = getStoredUtm();
  if (Object.keys(utm).length === 0) return url;

  try {
    const parsed = new URL(url, window.location.origin);
    Object.entries(utm).forEach(([k, v]) => {
      if (!parsed.searchParams.has(k)) {
        parsed.searchParams.set(k, v);
      }
    });
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Sends a marketing attribution event stub.
 * @param {string} eventName
 * @param {Record<string, any>} payload
 */
export function trackAttributionEvent(eventName, payload = {}) {
  const utm = getStoredUtm();
  console.info(`[Analytics Event: ${eventName}]`, {
    ...payload,
    attribution: utm,
    timestamp: new Date().toISOString(),
  });
}
