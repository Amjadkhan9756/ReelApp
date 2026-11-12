import bcrypt from 'bcryptjs';
import type { CookieOptions, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import type { Types } from 'mongoose';
import videoPartnerModel from '../models/video-partner.model.js';
import userModel from '../models/user.model.js';

interface UserCredentials {
  fullName: string;
  email: string;
  password: string;
}

interface VideoPartnerCredentials {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  contactName: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface MessageResponse {
  message: string;
}

interface UserAuthResponse extends MessageResponse {
  user: {
    _id: Types.ObjectId;
    email: string;
    fullName: string;
  };
}

interface VideoPartnerAuthResponse extends MessageResponse {
  videoPartner: {
    _id: Types.ObjectId;
    email: string;
    name: string;
    address?: string;
    contactName?: string;
    phone?: string;
  };
}

interface AuthenticatedSessionResponse {
  authenticated: true;
  role: 'user';
  account: {
    _id: Types.ObjectId;
    email: string;
    fullName: string;
  };
}

interface AuthenticatedPartnerSessionResponse {
  authenticated: true;
  role: 'video-partner';
  account: {
    _id: Types.ObjectId;
    email: string;
    name: string;
  };
}

type AuthResponse =
  | MessageResponse
  | UserAuthResponse
  | VideoPartnerAuthResponse
  | AuthenticatedSessionResponse
  | AuthenticatedPartnerSessionResponse
  | { authenticated: false };

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is required');
  return secret;
}

const cookieOptions: CookieOptions = process.env.NODE_ENV === 'production'
  ? { httpOnly: true, secure: true, sameSite: 'none' }
  : { httpOnly: true, sameSite: 'lax' };

function createToken(id: string): string {
  return jwt.sign({ id }, getJwtSecret());
}

const registerUser: RequestHandler<Record<string, string>, AuthResponse, UserCredentials> = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (
    typeof fullName !== 'string'
    || !fullName.trim()
    || typeof email !== 'string'
    || !email.trim()
    || typeof password !== 'string'
    || !password
  ) {
    res.status(400).json({ message: 'Full name, email, and password are required' });
    return;
  }

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password.toString(), 10);
  const user = await userModel.create({ fullName, email, password: hashedPassword });

  res.cookie('token', createToken(user._id.toString()), cookieOptions);
  res.status(201).json({
    message: 'User registered successfully',
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
  });
};

const loginUser: RequestHandler<Record<string, string>, AuthResponse, LoginCredentials> = async (req, res) => {
  const { email, password } = req.body;
  if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  const user = await userModel.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(400).json({ message: 'Invalid email or password' });
    return;
  }

  res.cookie('token', createToken(user._id.toString()), cookieOptions);
  res.status(200).json({
    message: 'User logged in successfully',
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
  });
};

const logoutUser: RequestHandler<Record<string, string>, AuthResponse, unknown> = (_req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'user logged out successfully ' });
};

const registerVideoPartner: RequestHandler<Record<string, string>, AuthResponse, VideoPartnerCredentials> = async (req, res) => {
  const { name, email, password, phone, address, contactName } = req.body;
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (
    typeof name !== 'string' || !name.trim()
    || typeof contactName !== 'string' || !contactName.trim()
    || typeof phone !== 'string' || !phone.trim()
    || typeof address !== 'string' || !address.trim()
    || !normalizedEmail
    || typeof password !== 'string' || !password
  ) {
    res.status(400).json({ message: 'All registration fields are required' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters' });
    return;
  }

  const existingPartner = await videoPartnerModel.findOne({ email: normalizedEmail });
  if (existingPartner) {
    res.status(400).json({
      message: 'This email is already registered. Please sign in or use another email.',
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const videoPartner = await videoPartnerModel.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    phone,
    address,
    contactName,
  });

  res.cookie('token', createToken(videoPartner._id.toString()), cookieOptions);
  res.status(201).json({
    message: 'Video partner registered successfully',
    videoPartner: {
      _id: videoPartner._id,
      email: videoPartner.email,
      name: videoPartner.name,
      address: videoPartner.address,
      contactName: videoPartner.contactName,
      phone: videoPartner.phone,
    },
  });
};

const loginVideoPartner: RequestHandler<Record<string, string>, AuthResponse, LoginCredentials> = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!normalizedEmail || typeof password !== 'string' || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  const videoPartner = await videoPartnerModel.findOne({ email: normalizedEmail });
  if (!videoPartner || !(await bcrypt.compare(password, videoPartner.password))) {
    res.status(400).json({ message: 'Invalid email or password' });
    return;
  }

  res.cookie('token', createToken(videoPartner._id.toString()), cookieOptions);
  res.status(200).json({
    message: 'Video partner logged in successfully',
    videoPartner: {
      _id: videoPartner._id,
      email: videoPartner.email,
      name: videoPartner.name,
    },
  });
};

const logoutVideoPartner: RequestHandler<Record<string, string>, AuthResponse, unknown> = (_req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Video partner logged out successfully' });
};

const getSession: RequestHandler<Record<string, string>, AuthResponse, unknown> = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ authenticated: false });
    return;
  }

  let decoded: string | jwt.JwtPayload;
  try {
    decoded = jwt.verify(token, getJwtSecret());
  } catch (error: unknown) {
    if (!(error instanceof jwt.JsonWebTokenError)) throw error;
    res.status(401).json({ authenticated: false });
    return;
  }

  if (typeof decoded === 'string' || typeof decoded.id !== 'string') {
    res.status(401).json({ authenticated: false });
    return;
  }

  const user = await userModel.findById(decoded.id).select('_id email fullName');
  if (user) {
    const response: AuthenticatedSessionResponse = {
      authenticated: true,
      role: 'user',
      account: user,
    };
    res.status(200).json(response);
    return;
  }

  const videoPartner = await videoPartnerModel.findById(decoded.id).select('_id email name');
  if (videoPartner) {
    const response: AuthenticatedPartnerSessionResponse = {
      authenticated: true,
      role: 'video-partner',
      account: videoPartner,
    };
    res.status(200).json(response);
    return;
  }
  res.status(401).json({ authenticated: false });
};

export const authController = {
  registerUser,
  loginUser,
  logoutUser,
  registerVideoPartner,
  loginVideoPartner,
  logoutVideoPartner,
  getSession,
};
