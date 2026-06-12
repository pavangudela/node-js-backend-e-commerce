import sequelize from '../database/sequelize.js';
import { User } from '../models/index.js';
import roles from '../constants/roles.js';
import tokenTypes from '../constants/tokenTypes.js';
import env from '../config/env.js';
import AppError from '../utils/AppError.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { sendEmail } from '../utils/email.js';
import tokenService from './token.service.js';

const safeUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  isEmailVerified: user.isEmailVerified
});

const register = async (payload, req) => sequelize.transaction(async (transaction) => {
  const existing = await User.unscoped().findOne({ where: { email: payload.email }, transaction });
  if (existing) throw new AppError('User already exists', 409);

  const user = await User.create({
    username: payload.username,
    email: payload.email,
    password: await hashPassword(payload.password),
    role: roles.CUSTOMER
  }, { transaction });

  const token = await tokenService.createUserToken(
    user.id,
    tokenTypes.EMAIL_VERIFICATION,
    new Date(Date.now() + env.emailVerificationExpiresHours * 3600000),
    transaction
  );

  await sendEmail({
    to: user.email,
    subject: 'Verify your email',
    html: `<p>Verify your account: <a href="${env.appBaseUrl}/verify-email?token=${token}">Verify email</a></p>`
  });

  const tokens = await tokenService.issueAuthTokens(user, req, transaction);
  return { user: safeUser(user), ...tokens };
});

const login = async (payload, req) => {
  const user = await User.unscoped().findOne({ where: { email: payload.email } });
if(!user){
 throw new AppError('Invalid email ', 401);
}


  if(!user.isEmailVerified){
    throw new AppError('Email not verified. Please verify your email before logging in.', 403);
  }
  if (!user || !(await comparePassword(payload.password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }
  if (!user.isActive) throw new AppError('User account is disabled', 403);

  user.lastLoginAt = new Date();
  await user.save();
  return { user: safeUser(user), ...(await tokenService.issueAuthTokens(user, req)) };
};

const refresh = (refreshToken, req) => tokenService.rotateRefreshToken(refreshToken, req);
const logout = (refreshToken) => tokenService.revokeRefreshToken(refreshToken);

const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return;
  const token = await tokenService.createUserToken(
    user.id,
    tokenTypes.PASSWORD_RESET,
    new Date(Date.now() + env.passwordResetExpiresMinutes * 60000)
  );
  await sendEmail({
    to: user.email,
    subject: 'Reset your password',
    html: `<p>Reset your password: <a href="${env.appBaseUrl}/reset-password?token=${token}">Reset password</a></p>`
  });
};

const resetPassword = async ({ token, password }) => sequelize.transaction(async (transaction) => {
  const record = await tokenService.consumeUserToken(token, tokenTypes.PASSWORD_RESET, transaction);
  
  const user = await User.unscoped().findByPk(record.userId, { transaction });
  if (await comparePassword(password, user.password)) {
    throw new AppError('New password must be different from the old password', 400);
  }
  user.password = await hashPassword(password);
  await user.save({ transaction });
});

const verifyEmail = async (token) => sequelize.transaction(async (transaction) => {
  const record = await tokenService.consumeUserToken(token, tokenTypes.EMAIL_VERIFICATION, transaction);
  await User.update({ isEmailVerified: true }, { where: { id: record.userId }, transaction });
});

export default {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail
};
