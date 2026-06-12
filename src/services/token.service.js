import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { RefreshToken, User, UserToken } from '../models/index.js';
import { hashToken, randomToken } from '../utils/crypto.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import AppError from '../utils/AppError.js';

const expiresFromNow = (value) => {
  const match = String(value).match(/^(\d+)([smhd])$/);
  const amount = match ? Number(match[1]) : 30;
  const unit = match ? match[2] : 'd';
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return new Date(Date.now() + amount * multipliers[unit]);
};

const issueAuthTokens = async (user, req, transaction) => {
  const placeholder = randomToken();
  const refreshRecord = await RefreshToken.create({
    userId: user.id,
    tokenHash: hashToken(placeholder),
    expiresAt: expiresFromNow(env.jwt.refreshExpiresIn),
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  }, { transaction });

  const refreshToken = signRefreshToken(user, refreshRecord.id);
  refreshRecord.tokenHash = hashToken(refreshToken);
  await refreshRecord.save({ transaction });

  return {
    accessToken: signAccessToken(user),
    refreshToken
  };
};

const rotateRefreshToken = async (refreshToken, req) => {
   console.log('TYPE:', typeof refreshToken);
  console.log('VALUE:', JSON.stringify(refreshToken));
  const payload = verifyRefreshToken(refreshToken);
    console.log("Decoded payload:", payload);
  const record = await RefreshToken.findByPk(payload.tokenId);
  if (!record || record.revokedAt || record.expiresAt < new Date()) {
    throw new AppError('Refresh token is invalid or expired', 401);
  }
  if (record.tokenHash !== hashToken(refreshToken)) {
    throw new AppError('Refresh token mismatch', 401);
  }

  const user = await User.findByPk(payload.id);
  const tokens = await issueAuthTokens(user, req);
  record.revokedAt = new Date();
  record.replacedByTokenId = jwt.decode(tokens.refreshToken).tokenId;
  await record.save();
  return tokens;
};

const revokeRefreshToken = async (refreshToken) => {
  const payload = verifyRefreshToken(refreshToken);
  await RefreshToken.update({ revokedAt: new Date() }, { where: { id: payload.tokenId } });
};

const createUserToken = async (userId, type, expiresAt, transaction) => {
  const token = randomToken();
  await UserToken.create({
    userId,
    type,
    tokenHash: hashToken(token),
    expiresAt
  }, { transaction });
  return token;
};

const consumeUserToken = async (token, type, transaction) => {
  const record = await UserToken.findOne({
    where: { tokenHash: hashToken(token), type, consumedAt: null },
    transaction
  });

  if (!record || record.expiresAt < new Date()) {
    throw new AppError('Token is invalid or expired', 400);
  }

  record.consumedAt = new Date();
  await record.save({ transaction });
  return record;
};

export default {
  issueAuthTokens,
  rotateRefreshToken,
  revokeRefreshToken,
  createUserToken,
  consumeUserToken
};
