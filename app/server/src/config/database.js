import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'makeitoss';
const MAX_RETRIES = parseInt(process.env.MONGO_CONNECT_RETRY) || 5;

let retries = 0;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: MONGO_DB_NAME,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    retries += 1;
    console.error(`MongoDB connection failed (${retries}/${MAX_RETRIES}):`, error.message);
    if (retries < MAX_RETRIES) {
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    } else {
      console.error('Could not connect to MongoDB. Exiting...');
      process.exit(1);
    }
  }
};

// Graceful shutdown
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected!');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

export default connectDB;
