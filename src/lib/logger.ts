/**
 * Minimal structured logger — zero dependencies, intentionally small.
 *
 * - Production (NODE_ENV=production): one JSON object per line (good for
 *   journald/docker log shipping and Sentry/Grafana ingestion).
 * - Development: human-readable single lines.
 *
 * A full observability stack (Sentry, request correlation ids) is wired in a
 * later phase via instrumentation.ts — keep call sites on this interface so
 * the swap stays mechanical.
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const MIN_LEVEL: LogLevel =
  process.env.NODE_ENV === "production"
    ? "info"
    : (process.env.LOG_LEVEL as LogLevel | undefined) ?? "debug";

function write(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[MIN_LEVEL]) return;

  if (process.env.NODE_ENV === "production") {
    // `console.*` maps to stdout/stderr — the right target for container logs.
    const line = JSON.stringify({
      ts: new Date().toISOString(),
      level,
      msg: message,
      ...meta,
    });
    (level === "error" || level === "warn" ? console.error : console.log)(line);
    return;
  }

  const suffix = meta && Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
  const formatted = `[${level.toUpperCase()}] ${message}${suffix}`;
  (level === "error" || level === "warn" ? console.error : console.log)(formatted);
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => write("debug", message, meta),
  info: (message: string, meta?: Record<string, unknown>) => write("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => write("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => write("error", message, meta),
} as const;