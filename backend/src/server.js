import app from './app.js';
import connectDB from './config/db.js';
import config from './config/config.js';
import mongoose from 'mongoose';
import { ensureSuperAdmin } from './services/superAdminService.js';

const startServer = async () => {
  await connectDB();

  if (mongoose.connection.readyState === 1) {
    await ensureSuperAdmin();
  }

  app.listen(config.port, () => {
    console.log(`KRISHIQ backend running on port ${config.port}`);
  });
};

startServer();

const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));