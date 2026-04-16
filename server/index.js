import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'vitalsync';
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is required in .env');
}

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in .env');
}

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: false,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/auth/admin/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: email.toLowerCase(), role: 'admin' });

  if (!user) {
    return res.status(401).json({ message: 'Invalid admin credentials.' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid admin credentials.' });
  }

  const token = jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '12h' }
  );

  return res.json({
    token,
    role: user.role,
    email: user.email,
  });
});

app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Server error. Please try again.' });
});

const start = async () => {
  await mongoose.connect(MONGODB_URI, {
    dbName: MONGODB_DB_NAME,
  });
  console.log('MongoDB connected');

  app.listen(PORT, () => {
    console.log(`Auth server running on http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
