import express from "express";

import apiRoutes from "./routes/index.js";
import healthRoutes from "./routes/health.js";
import authRoutes from "./routes/auth.js";
import githubRoutes from "./routes/githubRoutes.js";

import applySecurity from "./middlewares/security.js";
import logger from "./config/logger.js";
import { sanitizeMiddleware } from "./middlewares/validation.js";
import { buildEndpointRateLimiters, globalIpRateLimiter } from "./middlewares/rateLimiter.js";
import { rateLimits } from "./utils/securityConfig.js";
import cors from "cors"
import { preventDuplicateOAuth } from "./middlewares/auth.js";




const app = express();
app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));
app.use(express.json());
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
app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);
app.use("/health", healthRoutes);
app.use("/api", apiRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express with CORS!" });
});

export default app;
