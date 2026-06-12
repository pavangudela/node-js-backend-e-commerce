import { config } from 'dotenv';

config();

const required = [
  'DB_HOST',
  'DB_NAME',
  'DB_USER',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET'
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length && process.env.NODE_ENV === 'production') {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

export const nodeEnv = process.env.NODE_ENV || 'development';
export const port = Number(process.env.PORT || 5000);
export const apiPrefix = process.env.API_PREFIX || '/api';
export const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
export const corsOrigin = process.env.CORS_ORIGIN || '*';
export const db = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  name: process.env.DB_NAME || 'ecommerce_node',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  dialect: 'mysql'
};
export const jwt = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'development-access-secret-change-me',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'development-refresh-secret-change-me',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
};
export const bcryptRounds = Number(process.env.BCRYPT_ROUNDS || 12);
export const passwordResetExpiresMinutes = Number(process.env.PASSWORD_RESET_EXPIRES_MINUTES || 15);
export const emailVerificationExpiresHours = Number(process.env.EMAIL_VERIFICATION_EXPIRES_HOURS || 24);
export const smtp = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.SMTP_FROM || 'E-Commerce <gudelapavan9090@gmail.com>'
};
export const razorpay = {
  keyId: process.env.RAZORPAY_KEY_ID,
  keySecret: process.env.RAZORPAY_KEY_SECRET,
  webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET
};
export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET
};

export default {
  nodeEnv,
  port,
  apiPrefix,
  appBaseUrl,
  corsOrigin,
  db,
  jwt,
  bcryptRounds,
  passwordResetExpiresMinutes,
  emailVerificationExpiresHours,
  smtp,
  razorpay,
  cloudinary
};
