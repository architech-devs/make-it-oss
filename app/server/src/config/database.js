import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const MAX_RETRIES = 5;
let retries = 0;

if (!MONGO_URI) {
  logger.error("Missing required env var: MONGO_URI");
  process.exit(1);
}

const connectDB = async () => {
  while (retries < MAX_RETRIES) {
    try {
      await mongoose.connect(MONGO_URI);
      logger.info("Connected to MongoDB successfully");
      return;
    } catch (error) {
      retries += 1;
      logger.error(`MongoDB connection failed (${retries}/${MAX_RETRIES}): ${error.message}`);
      if (retries < MAX_RETRIES) {
        logger.warn("Retrying connection in 5 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        logger.error("🚨 Max retries reached. Exiting process.");
        process.exit(1);
      }
    }
  }
};
export default connectDB;
