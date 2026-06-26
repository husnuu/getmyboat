const buckets = new Map<string, number[]>();

/** Simple in-memory per-user send rate limit (messages per minute). */
export function assertSendRateLimit(userId: string, maxPerMinute = 30): void {
  const now = Date.now();
  const windowMs = 60_000;
  const recent = (buckets.get(userId) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= maxPerMinute) {
    throw new Error("RATE_LIMIT");
  }
  recent.push(now);
  buckets.set(userId, recent);
}
