import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const required = ['PORT', 'NODE_ENV'];

required.forEach((key) => {
  if (!process.env[key]) {
    logger.error(`❌ Missing required env var: ${key}`);
    process.exit(1);
  }
});

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
