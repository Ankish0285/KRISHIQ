import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config/config.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import buyerRoutes from './routes/buyerRoutes.js';
import farmerRoutes from './routes/farmerRoutes.js';
import fpoRoutes from './routes/fpoRoutes.js';
import logisticsRoutes from './routes/logisticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();

const allowlist = [config.frontendUrl];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowlist.includes('*') || allowlist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS blocked'));
      }
    },
    credentials: true,
  })
);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'KRISHIQ backend is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/fpo', fpoRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payment', paymentRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

app.use(errorMiddleware);

export default app;