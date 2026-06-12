import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export const signAccessToken = (user) => jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  env.jwt.accessSecret,
  { expiresIn: env.jwt.accessExpiresIn }
);

export const signRefreshToken = (user, tokenId) => jwt.sign(
  { id: user.id, tokenId },
  env.jwt.refreshSecret,
  { expiresIn: env.jwt.refreshExpiresIn }
);

export const verifyAccessToken = (token) => jwt.verify(token, env.jwt.accessSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, env.jwt.refreshSecret);

export default {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
