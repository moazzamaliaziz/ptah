/**
 * Sliding-window rate limiter.
 *
 * PHASE 0: in-memory implementation. Correct for exactly ONE Node process —
 * which matches the Phase-1 deployment shape (single VPS, one Next server).
 *
 * SCALING TODO(later phase): once we run more than one process/instance,
 * swap `InMemoryRateLimiter` for a Redis-backed implementation sharing this
 * interface (docker-compose.yml already carries a commented `redis` service).
 * All call sites depend only on `RateLimiter`, so the swap is local to
 * `getRateLimiter()`.
 */

import { setInterval } from "node:timers";

export interface RateLimitResult {
  allowed: boolean;
  /** Requests used in the current window (including this one). */
  used: number;
  /** Configured maximum. */
  limit: number;
  /** Milliseconds until the oldest request leaves the window (0 when allowed). */
  retryAfterMs: number;
  limitPer: number;
  windowMs: number;
}

export interface RateLimiter {
  consume(key: string, limitPer: number, windowMs: number): RateLimitResult;
  /** Test/maintenance helper — clears all state. */
  reset(): void;
}

class InMemoryRateLimiter implements RateLimiter {
  /** key → timestamps (ms epoch) of accepted requests still inside their window. */
  private readonly hits = new Map<string, number[]>();
  private sweeper: NodeJS.Timeout | null = null;

  consume(key: string, limitPer: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    const windowStart = now - windowMs;
    const existing = (this.hits.get(key) ?? []).filter((t) => t > windowStart);

    if (existing.length >= limitPer) {
      this.hits.set(key, existing);
      return {
        allowed: false,
        used: existing.length,
        limit: limitPer,
        retryAfterMs: existing[0] + windowMs - now,
        limitPer,
        windowMs,
      };
    }

    existing.push(now);
    this.hits.set(key, existing);
    return {
      allowed: true,
      used: existing.length,
      limit: limitPer,
      retryAfterMs: 0,
      limitPer,
      windowMs,
    };
  }

  reset(): void {
    this.hits.clear();
  }

  /** Start an interval that lazily evicts expired entries (dev ergonomics). */
  startSweeper(intervalMs = 60_000): void {
    if (this.sweeper) return;
    this.sweeper = setInterval(() => {
      const now = Date.now();
      for (const [key, timestamps] of this.hits) {
        const live = timestamps.filter((t) => t > now - 3_600_000); // hard cap 1h
        if (live.length === 0) this.hits.delete(key);
        else this.hits.set(key, live);
      }
    }, intervalMs);
    // Never keep the Node process alive just for housekeeping.
    this.sweeper.unref();
  }
}

const globalForRateLimit = globalThis as unknown as {
  rateLimiter: InMemoryRateLimiter | undefined;
};

/** Process-wide limiter instance (survives HMR like the Prisma singleton). */
export function getRateLimiter(): RateLimiter {
  if (!globalForRateLimit.rateLimiter) {
    const limiter = new InMemoryRateLimiter();
    limiter.startSweeper();
    globalForRateLimit.rateLimiter = limiter;
  }
  return globalForRateLimit.rateLimiter;
}

/**
 * Convenience guard for route handlers:
 *   const blocked = rateLimitOrThrow(`login:${ip}`, 5, 60_000);
 *   if (blocked) return blocked; // a prebuilt 429 NextResponse is built by the caller
 */
export function checkRateLimit(
  key: string,
  limitPer: number,
  windowMs: number,
): RateLimitResult {
  return getRateLimiter().consume(key, limitPer, windowMs);
}