import express from "express";
import cors from "cors";

import apiRoutes from "./routes/index.js";
import healthRoutes from "./routes/health.js";


const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/health", healthRoutes);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express with CORS!" });
});

export default app;
