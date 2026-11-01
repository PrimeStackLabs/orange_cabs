import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import fareRoutes from './routes/fareRoutes.js';
import fleetRoutes from './routes/fleetRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

dotenv.config();

const isProductionRuntime = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

const normalizeOrigin = (value) => {
  if (!value) return null;
  try {
    return new URL(value.includes('://') ? value : `https://${value}`).origin;
  } catch {
    return null;
  }
};

export const getAllowedOrigins = () => {
  const configuredOrigins = [
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
    process.env.VERCEL_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    ...(process.env.CORS_ORIGINS || '').split(',')
  ];

  if (!isProductionRuntime) {
    configuredOrigins.push(
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    );
  }

  return [...new Set(configuredOrigins.map(normalizeOrigin).filter(Boolean))];
};

export const createApp = ({ io } = {}) => {
  const app = express();
  const allowedOrigins = getAllowedOrigins();

  app.set('trust proxy', isProductionRuntime ? 1 : false);
  if (io) app.set('io', io);

  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use((req, res, next) => {
    const requestOrigin = `${req.protocol}://${req.get('host')}`;
    cors({
      origin(origin, callback) {
        if (!origin || origin === requestOrigin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        const error = new Error('This origin is not allowed to access the API.');
        error.statusCode = 403;
        callback(error);
      },
      credentials: true
    })(req, res, next);
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(isProductionRuntime ? 'combined' : 'dev'));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2000,
    message: { success: false, message: 'Too many requests, please try again later' }
  });
  app.use('/api', limiter);

  app.use('/api', async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (error) {
      console.error(`[MongoDB] API request could not connect: ${error.message}`);
      error.statusCode = 503;
      error.publicMessage = 'Database connection unavailable. Please try again later.';
      next(error);
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      database: 'connected',
      appName: 'Orange Cab API',
      version: '1.0.0',
      timestamp: new Date()
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/vehicles', fleetRoutes);
  app.use('/api/cabs', fleetRoutes);
  app.use('/api/drivers', driverRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/enquiries', enquiryRoutes);
  app.use('/api/content', contentRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/settings', settingRoutes);
  app.use('/api/fares', fareRoutes);
  app.use('/api/routes', routeRoutes);
  app.use('/api/packages', packageRoutes);
  app.use('/api/coupons', couponRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/blogs', blogRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
  });

  app.use(errorHandler);

  return app;
};

const app = createApp();

export default app;
