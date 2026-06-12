import asyncHandler from '../utils/asyncHandler.js';
import userService from '../services/user.service.js';

export const profile = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await userService.profile(req.user.id) });
});

export const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user.id, req.body.oldPassword, req.body.newPassword);
  res.json({ success: true, message: 'Password updated successfully' });
});

export const changeUsername = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await userService.changeUsername(req.user.id, req.body.username) });
});

export const listUsers = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await userService.listUsers() });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await userService.softDeleteUser(req.params.id);
  res.status(204).send();
});

export default {
  profile,
  changePassword,
  changeUsername,
  listUsers,
  deleteUser
};
