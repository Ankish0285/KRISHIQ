import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import config from './config.js';

mongoose.set('bufferCommands', false);

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  let mongoUri = config.mongodbUri;

  try {
    if (!mongoUri) {
      console.warn('MONGODB_URI not configured. Starting an in-memory MongoDB instance for local development.');
    }

    await mongoose.connect(mongoUri || 'mongodb://127.0.0.1:27017/krishiq', {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.warn('Primary MongoDB connection failed:', error.message);

    try {
      const mongoMemoryServer = await MongoMemoryServer.create();
      mongoUri = mongoMemoryServer.getUri();
      await mongoose.disconnect();
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });

      console.warn('Falling back to in-memory MongoDB for local development because the configured database is unavailable.');
    } catch (fallbackError) {
      console.error('MongoDB fallback failed:', fallbackError.message);
      throw fallbackError;
    }
  }
};

export default connectDB;