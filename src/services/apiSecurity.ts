/**
 * SkyPulse Enterprise API Security Layer
 * - Strict input sanitization & coordinate boundaries
 * - Rate limiting & call throttling (prevents Nominatim & Open-Meteo IP bans)
 * - In-memory TTL cache to eliminate redundant network roundtrips
 * - Request timeouts and safe error boundary normalization
 */

// Simple In-Memory TTL Cache Entry
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

/**
 * Store data with Time-To-Live in milliseconds
 */
export function getCached<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data as T;
}

/**
 * Set cache item with expiration
 */
export function setCached<T>(key: string, data: T, ttlMs: number): void {
  // Cap cache size to avoid unbounded memory growth
  if (memoryCache.size > 200) {
    const oldestKey = memoryCache.keys().next().value;
    if (oldestKey) memoryCache.delete(oldestKey);
  }
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Sanitize text inputs for city search to prevent injection attacks and malformed URIs
 */
export function sanitizeSearchQuery(input: unknown): string {
  if (typeof input !== "string") return "";
  // Strip control characters, html tags, script symbols, limit length to 60 characters
  return input
    .replace(/[<>{}[\]\\^`~|$%*+?]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}

/**
 * Validate and clamp geographical coordinates strictly within physical earth bounds
 */
export function validateCoordinates(
  latInput: unknown,
  lonInput: unknown
): { valid: boolean; lat: number; lon: number; error?: string } {
  const lat = typeof latInput === "number" ? latInput : parseFloat(String(latInput));
  const lon = typeof lonInput === "number" ? lonInput : parseFloat(String(lonInput));

  if (isNaN(lat) || !isFinite(lat) || isNaN(lon) || !isFinite(lon)) {
    return { valid: false, lat: 0, lon: 0, error: "Invalid coordinate numerical format" };
  }

  // Earth coordinates: Lat: [-90, 90], Lon: [-180, 180]
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return { valid: false, lat: 0, lon: 0, error: "Coordinates out of earth boundaries" };
  }

  // Round to 5 decimal places (~1.1 meter precision) to eliminate float noise & improve cache hit rate
  const safeLat = Math.round(lat * 100000) / 100000;
  const safeLon = Math.round(lon * 100000) / 100000;

  return { valid: true, lat: safeLat, lon: safeLon };
}

/**
 * Nominatim / Geocoding rate limiter
 * Strictly enforces a minimum delay (1000ms) between calls to prevent rate-limit blocks
 */
let lastNominatimTimestamp = 0;
const NOMINATIM_MIN_INTERVAL_MS = 1050; // OSM Nominatim usage policy: max 1 req/sec

export async function throttleNominatim(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastNominatimTimestamp;
  if (elapsed < NOMINATIM_MIN_INTERVAL_MS) {
    const delay = NOMINATIM_MIN_INTERVAL_MS - elapsed;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  lastNominatimTimestamp = Date.now();
}

/**
 * General client-side rate limiting tracker (Token bucket)
 */
class RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private refillRatePerSec: number;
  private lastRefill: number;

  constructor(maxTokens = 20, refillRatePerSec = 5) {
    this.tokens = maxTokens;
    this.maxTokens = maxTokens;
    this.refillRatePerSec = refillRatePerSec;
    this.lastRefill = Date.now();
  }

  public allowRequest(): boolean {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsedSeconds * this.refillRatePerSec);
    this.lastRefill = now;

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}

export const weatherApiLimiter = new RateLimiter(25, 5);

/**
 * Request timeout configuration helper (milliseconds)
 */
export const API_TIMEOUT_MS = 9000;

/**
 * Safe error sanitization to prevent leaking sensitive network traces or credentials
 */
export function sanitizeErrorMessage(err: unknown, fallback = "Network service unavailable"): string {
  if (typeof err === "string") return err.slice(0, 100);
  if (err && typeof err === "object") {
    const message = (err as { message?: string }).message;
    if (message) {
      if (message.includes("timeout")) return "Request timed out. Please check your connection.";
      if (message.includes("Network Error")) return "Network error. Unable to reach weather servers.";
      if (message.includes("429")) return "Rate limit reached. Please wait a moment.";
      return "Weather service encountered a temporary error.";
    }
  }
  return fallback;
}
