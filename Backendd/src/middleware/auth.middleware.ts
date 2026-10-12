import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import foodPartnerModel from '../models/foodpartner.model.js';
import userModel from '../models/user.model.js';

interface AuthErrorResponse {
  message: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is required');
  return secret;
}

function getAccountId(token: string): string | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    return typeof decoded === 'string' || typeof decoded.id !== 'string'
      ? null
      : decoded.id;
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) return null;
    throw error;
  }
}

export const authFoodPartnerMiddleware: RequestHandler<
  Record<string, string>,
  AuthErrorResponse,
  unknown
> = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: 'Please login first' });
    return;
  }

  const accountId = getAccountId(token);
  if (!accountId) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }

  req.foodPartner = await foodPartnerModel.findById(accountId);
  if (!req.foodPartner) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
  next();
};

export const authUserMiddleware: RequestHandler<
  Record<string, string>,
  AuthErrorResponse,
  unknown
> = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: 'Please login first' });
    return;
  }

  const accountId = getAccountId(token);
  if (!accountId) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }

  req.user = await userModel.findById(accountId);
  if (!req.user) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
  next();
};
