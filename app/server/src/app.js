import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

import apiRoutes from "./routes/index.js";
import healthRoutes from "./routes/health.js";
import connectDB from "./config/database.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
// Routes
app.use("/health", healthRoutes);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express with CORS!" });
});

export default app;
