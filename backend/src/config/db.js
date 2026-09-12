import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import config from './config.js';

mongoose.set('bufferCommands', false);

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    let mongoUri = config.mongodbUri;

    if (!mongoUri) {
      console.warn('MONGODB_URI not configured. Starting an in-memory MongoDB instance for local development.');

      const mongoMemoryServer = await MongoMemoryServer.create();
      mongoUri = mongoMemoryServer.getUri();
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.warn('MongoDB connection unavailable:', error.message);
  }
};

export default connectDB;