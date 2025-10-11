import cors from "cors";
import helmet from "helmet";
import express from "express";
import {
  bodyLimits,
  contentType,
  corsConfig,
  securityHeaders,
} from "../utils/securityConfig.js";

function configureHelmet(app, logger) {
  app.use(
    helmet({
      frameguard: { action: "deny" },
      referrerPolicy: { policy: "no-referrer" },
      contentSecurityPolicy: securityHeaders.enableCSP
        ? {
            useDefaults: true,
            directives: {
              "default-src": ["'self'"],
            },
          }
        : false,
      dnsPrefetchControl: { allow: false },
    })
  );
  logger?.info?.("Helmet security headers enabled");
}

function configureCors(app, logger) {
  const { allowedOrigins, allowCredentials } = corsConfig;

  if (allowedOrigins.length === 0) {
    logger?.warn?.("CORS allowed origins not set; allowing all origins");
    app.use(
      cors({
        origin: true,
        credentials: allowCredentials,
      })
    );
    return;
  }

  const set = new Set(allowedOrigins);
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin || set.has(origin)) return cb(null, true);
        return cb(new Error("CORS: Origin not allowed"));
      },
      credentials: allowCredentials,
    })
  );
}

function basicSecurityHeaders(app) {
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
  });
}

function contentTypeEnforcer() {
  const methods = new Set(contentType.enforceJsonOn);
  return (req, res, next) => {
    if (methods.has(req.method.toUpperCase())) {
      const isJson = req.is("application/json");
      if (!isJson) {
        return res
          .status(415)
          .json({ error: "Unsupported Media Type. Use application/json" });
      }
    }
    return next();
  };
}

function requestSizeLimits(app) {
  app.use(express.json({ limit: bodyLimits.json }));
  app.use(express.urlencoded({ extended: true, limit: bodyLimits.urlencoded }));
}

export default function applySecurity(app, logger) {
  basicSecurityHeaders(app);
  configureHelmet(app, logger);
  configureCors(app, logger);
  app.use(contentTypeEnforcer());
  requestSizeLimits(app);   
}