import express from "express";
import cors from "cors";

import apiRoutes from "./routes/index.js";
import healthRoutes from "./routes/health.js";
import { setupSwagger } from "./docs/swagger.js"; 

const app = express();

app.use(cors());
app.use(express.json());

(async () => {
  try {
    await setupSwagger(app);
    console.log("✅ Swagger UI available at /api-docs");
  } catch (err) {
    console.error("❌ Failed to setup Swagger:", err.message);
  }
})();

// Routes
app.use("/health", healthRoutes);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express with CORS!" });
});

export default app;
