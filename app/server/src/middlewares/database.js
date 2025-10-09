import mongoose from 'mongoose';

export const dbMiddleware = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ message: 'Database not connected' });
  }
  next();
};
