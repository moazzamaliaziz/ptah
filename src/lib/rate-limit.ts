/**
 * Rate limiter — in-memory by default, Redis-backed when configured.
 *
 * `checkRateLimit()` (async) is the single entry point every caller uses:
 *   - REDIS_URL set  → a shared Redis fixed-window counter (atomic Lua), so the
 *     limit is enforced across ALL processes/instances (correct under
 *     horizontal scaling). Any Redis error/timeout FAILS OPEN to the in-memory
 *     limiter — a rate limiter must never take the app down.
 *   - REDIS_URL unset → the in-memory sliding-window limiter, which is correct
 *     for a single Node process (the single-VPS deployment shape).
 *
 * The in-memory limiter (`InMemoryRateLimiter`) is retained unchanged as both
 * the default and the fallback.
 */

import { setInterval } from "node:timers";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

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

// ── Redis-backed limiter (optional; shared across instances) ─────────────────

type RedisClient = InstanceType<typeof import("ioredis").default>;

/** Lazy ioredis singleton — created only when REDIS_URL is set, once (HMR-safe). */
const globalForRedis = globalThis as unknown as {
  rateLimitRedis?: RedisClient | null;
};

async function getRedis(): Promise<RedisClient | null> {
  if (!env.REDIS_URL) return null;
  if (globalForRedis.rateLimitRedis !== undefined) return globalForRedis.rateLimitRedis;
  try {
    const { default: Redis } = await import("ioredis");
    const client = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      connectTimeout: 3_000,
    });
    // A connection error must not throw here — commands will reject and we fail
    // open to in-memory. Just log so operators can see misconfiguration.
    client.on("error", (e) =>
      logger.warn("rate-limit redis error", { error: e instanceof Error ? e.message : String(e) }),
    );
    globalForRedis.rateLimitRedis = client;
    return client;
  } catch (error) {
    logger.warn("rate-limit redis init failed — using in-memory", {
      error: error instanceof Error ? error.message : String(error),
    });
    globalForRedis.rateLimitRedis = null;
    return null;
  }
}

// Atomic fixed-window: INCR the counter, set the window TTL on the first hit,
// return [count, pttl]. One round trip, no read-modify-write race across procs.
const FIXED_WINDOW_LUA = `
local c = redis.call('INCR', KEYS[1])
if c == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
local ttl = redis.call('PTTL', KEYS[1])
return {c, ttl}
`;

async function consumeRedis(
  client: RedisClient,
  key: string,
  limitPer: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const res = (await client.eval(FIXED_WINDOW_LUA, 1, `rl:${key}`, String(windowMs))) as [number, number];
  const used = Number(res[0]);
  const ttl = Number(res[1]);
  const allowed = used <= limitPer;
  return {
    allowed,
    used,
    limit: limitPer,
    retryAfterMs: allowed ? 0 : ttl > 0 ? ttl : windowMs,
    limitPer,
    windowMs,
  };
}

/**
 * Consume one unit against `key`. ASYNC because the Redis path is networked;
 * all callers `await` it. Uses the shared Redis limiter when REDIS_URL is set,
 * and falls back to the in-memory limiter when it is not — or on ANY Redis
 * error (fail-open: a rate limiter must never break the request path).
 */
export async function checkRateLimit(
  key: string,
  limitPer: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const client = await getRedis();
  if (client) {
    try {
      return await consumeRedis(client, key, limitPer, windowMs);
    } catch (error) {
      logger.warn("rate-limit redis consume failed — using in-memory", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return getRateLimiter().consume(key, limitPer, windowMs);
}