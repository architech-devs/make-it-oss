import express from "express";
import cors from "cors";

import apiRoutes from "./routes/index.js";
import healthRoutes from "./routes/health.js";
import authRoutes from "./routes/auth.js";
import githubRoutes from "./routes/githubRoutes.js";



const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true               // allow cookies
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);
app.use("/health", healthRoutes);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express with CORS!" });
});

export default app;
