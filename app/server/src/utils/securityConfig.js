export const rateLimits = {
    "/api/project/scan": {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10, 
        message: "Too many requests from this IP, please try again later."
    },
    "/api/showcase/submit": {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 3, 
        message: "Too many submissions from this IP, please try again later."
    },
    "/api/stats": {
        windowMs: 5 * 60 * 1000, // 5 minutes
        max: 100,
        message: "Too many requests from this IP, please try again later."
    },
};

export const globalIpLimit = {
  windowMs: Number(process.env.RATE_GLOBAL_WINDOW_MS || 60 * 1000), // 1m
  max: Number(process.env.RATE_GLOBAL_MAX || 120), // 120 req/min per IP
  blockDurationMs: Number(process.env.RATE_GLOBAL_BLOCK_MS || 10 * 60 * 1000), // 10m
};

export const corsConfig = {
  allowedOrigins: (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5173, http://localhost:3000')
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  allowCredentials: true,
};

export const securityHeaders = {
  enableCSP: process.env.SECURITY_ENABLE_CSP !== "false",
};

export const bodyLimits = {
  json: process.env.REQUEST_JSON_LIMIT || "1mb",
  urlencoded: process.env.REQUEST_URLENCODED_LIMIT || "1mb",
};

export const contentType = {
  enforceJsonOn: ["POST", "PUT", "PATCH"],
};

export const abusePrevention = {
  strikesToBlock: Number(process.env.ABUSE_STRIKES || 5),
  strikeWindowMs: Number(process.env.ABUSE_STRIKE_WINDOW_MS || 10 * 60 * 1000), // 10m
  tempBlockMs: Number(process.env.ABUSE_TEMP_BLOCK_MS || 30 * 60 * 1000), // 30m
  botUserAgents: [/curl\/\d/i, /^python-requests/i, /wget/i, /bot/i],
};