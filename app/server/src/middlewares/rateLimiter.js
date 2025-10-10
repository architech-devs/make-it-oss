import { abusePrevention, globalIpLimit } from "../utils/securityConfig.js";

const perKeyTimestamps = new Map(); 
const ipStrikes = new Map(); 
const tempBlockedIps = new Map();

const now = () => Date.now();

function clientIp(req) {
  const hdr = req.headers["x-forwarded-for"];
  if (hdr && typeof hdr === "string") {
    return hdr.split(",")[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || "unknown";
}


function isTemporarilyBlocked(ip) {
  const until = tempBlockedIps.get(ip);
  if (!until) return false;
  if (until > now()) return true;
  tempBlockedIps.delete(ip);
  return false;
}

function blockIp(ip, ms, logger) {
  tempBlockedIps.set(ip, now() + ms);
  logger?.warn?.(`Temp-blocked IP ${ip} for ${ms}ms`);
}

function recordStrike(ip, logger) {
  const ts = now();
  const strikes = ipStrikes.get(ip) || [];
  strikes.push(ts);
  ipStrikes.set(ip, strikes);
  logger?.info?.(`Recorded strike for IP ${ip}`);
}

function pruneOldStrikes(ip, windowMs) {
  const cutoff = now() - windowMs;
  const strikes = ipStrikes.get(ip) || [];
  const pruned = strikes.filter((t) => t >= cutoff);
  if (pruned.length) {
    ipStrikes.set(ip, pruned);
  } else {
    ipStrikes.delete(ip);
  }
  return pruned.length;
}

function setRateHeaders(res, { limit, remaining, retryAfterSec, resetMs }) {
  if (typeof limit === "number") res.setHeader("X-RateLimit-Limit", String(limit));
  if (typeof remaining === "number")
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, remaining)));
  if (typeof retryAfterSec === "number" && retryAfterSec > 0)
    res.setHeader("Retry-After", String(retryAfterSec));
  if (typeof resetMs === "number" && resetMs >= 0)
    res.setHeader("X-RateLimit-Reset", String(Math.ceil(resetMs / 1000))); 
}

function slidingWindowLimit({ key, windowMs, max, logger }) {
  return (req, res, next) => {
    const ip = clientIp(req);
    if (isTemporarilyBlocked(ip)) {
      setRateHeaders(res, { limit: max, remaining: 0, retryAfterSec: 60 });
      return res.status(429).json({ error: "Too many requests. Try again later." });
    }

    const currentTs = now();
    const storeKey = `${key}:${ip}`;
    const cutoff = currentTs - windowMs;

    const arr = perKeyTimestamps.get(storeKey) || [];
    const fresh = arr.filter((t) => t >= cutoff);
    fresh.push(currentTs);
    perKeyTimestamps.set(storeKey, fresh);

    const remaining = max - fresh.length;
    const oldest = fresh[0] || currentTs;
    const resetMs = windowMs - (currentTs - oldest);

    if (fresh.length > max) {
      recordStrike(ip, logger);
      const strikesCount = pruneOldStrikes(ip, abusePrevention.strikeWindowMs);
      if (strikesCount >= abusePrevention.strikesToBlock) {
        blockIp(ip, abusePrevention.tempBlockMs, logger);
      }

      setRateHeaders(res, {
        limit: max,
        remaining: 0,
        retryAfterSec: Math.ceil(resetMs / 1000),
        resetMs,
      });
      return res.status(429).json({ error: "Too many requests", key });
    }

    setRateHeaders(res, { limit: max, remaining, resetMs });
    next();
  };
}

export function buildEndpointRateLimiters(rateLimitsMap, logger) {
  return Object.entries(rateLimitsMap).map(([path, cfg]) => ({
    path,
    middleware: slidingWindowLimit({
      key: `ep:${path}`,
      windowMs: cfg.windowMs,
      max: cfg.max,
      logger,
    }),
    message: cfg.message,
  }));
}

export function globalIpRateLimiter(logger) {
  const { windowMs, max, blockDurationMs } = globalIpLimit;
  const limiter = slidingWindowLimit({
    key: "global",
    windowMs,
    max,
    logger,
  });

  return (req, res, next) => {
    const ip = clientIp(req);
    if (isTemporarilyBlocked(ip)) {
      setRateHeaders(res, { limit: max, remaining: 0, retryAfterSec: Math.ceil(blockDurationMs / 1000) });
      return res.status(429).json({ error: "Too many requests. Try again later." });
    }
    limiter(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  };
}