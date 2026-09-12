import app from './app.js';
import connectDB from './config/db.js';
import config from './config/config.js';

const startServer = async () => {
  await connectDB();

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