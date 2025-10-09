import app from "./src/app.js";
import { PORT } from "./src/config/env.js";
import connectDB from './src/config/database.js';
import logger from './src/config/logger.js';

const startServer = async () => {
  try {
    await connectDB(); 
    logger.info(" MongoDB connected — starting server...");


    app.listen(PORT, () => {
      logger.info(`Server running locally at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to connect to MongoDB. Server not started.");
    process.exit(1);
  }
};

startServer(); 

export default app;
    