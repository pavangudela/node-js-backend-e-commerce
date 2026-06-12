import asyncHandler from '../utils/asyncHandler.js';
import authService from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await authService.register(req.body, req) });
});

export const login = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await authService.login(req.body, req) });
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
     
  res.json({ success: true, data: await authService.refresh(refreshToken, req) });
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.json({ success: true, message: 'Logged out successfully' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  res.json({ success: true, message: 'If that email exists, a reset link has been sent' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  res.json({ success: true, message: 'Password reset successfully' });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.body.token);
  res.json({ success: true, message: 'Email verified successfully' });
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
