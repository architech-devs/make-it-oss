import mongoose from 'mongoose';

export const getHealth = (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy 🚀",
    timestamp: new Date().toISOString(),
  });
};

export const dbHealthCheck = (req, res) => {
  const status = mongoose.connection.readyState === 1 ? 'UP' : 'DOWN';
  res.json({
    database: {
      status,
      state: mongoose.connection.readyState,
    },
  });
};
