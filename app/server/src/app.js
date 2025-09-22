import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRoutes from "./routes/health.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/health", healthRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express with CORS!" });
});

export default app;
