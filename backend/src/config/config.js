import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();
dotenv.config({
  path: path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../../dont touch/backend/.env'
  ),
});

const config = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || '*',
  cloudinary: {
    cloudName: String(process.env.CLOUDINARY_CLOUD_NAME || '').trim().toLowerCase(),
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  },
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  otp: {
    expiresInMinutes: Number(process.env.OTP_EXPIRES_MINUTES || 5),
    resendCooldownSeconds: Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60),
    maxAttempts: Number(process.env.OTP_MAX_ATTEMPTS || 5),
  },
  superAdmin: {
    email: process.env.SUPER_ADMIN_EMAIL || '',
    password: process.env.SUPER_ADMIN_PASSWORD || '',
  },
};

export default config;