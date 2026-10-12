import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import path from 'node:path';
import authRoutes from './routes/auth.routes.js';
import foodPartnerRoutes from './routes/food-partner.routes.js';
import foodRoutes from './routes/food.routes.js';

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/videos', express.static(path.resolve(process.cwd(), 'videos')));

app.get('/', (_req, res) => {
  res.send('hello  world');
});
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, next) => {
  console.error('Request failed:', error);
  if (res.headersSent) {
    next(error);
    return;
  }
  res.status(500).json({ message: 'Internal server error' });
};

app.use(errorHandler);

export default app;
