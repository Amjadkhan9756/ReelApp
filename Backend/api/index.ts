import type { Request, Response } from 'express';
import app from '../src/app.js';
import connectDB from '../src/db/db.js';

export default async function handler(req: Request, res: Response): Promise<void> {
  try {
    await connectDB();
    app(req, res);
  } catch (error: unknown) {
    console.error('API startup error:', error);
    res.status(503).json({ message: 'Database unavailable' });
  }
}
