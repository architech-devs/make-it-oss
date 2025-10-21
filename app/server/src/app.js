import express from "express";

import apiRoutes from "./routes/index.js";
import healthRoutes from "./routes/health.js";
import applySecurity from "./middlewares/security.js";
import logger from "./config/logger.js";
import { sanitizeMiddleware } from "./middlewares/validation.js";
import { buildEndpointRateLimiters, globalIpRateLimiter } from "./middlewares/rateLimiter.js";
import { rateLimits } from "./utils/securityConfig.js";
import showCaseRoutes from "./routes/showcase.js";

const app = express();

// 1. Global security handeling 
applySecurity(app, logger);
  
// 2. Sanitize all incoming JSON bodies
app.use(sanitizeMiddleware());

// 3. Global IP rate limiting
app.use(globalIpRateLimiter(logger));

// 3. Endpoint-specific rate limiting
for (const {path, middleware} of buildEndpointRateLimiters(rateLimits, logger)) {
  app.use(path, middleware);
}

// Routes
app.use("/health", healthRoutes);
app.use("/api", apiRoutes);
app.use("/api/showcase", showCaseRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Hello from Express with CORS!" });
});

export default app;
