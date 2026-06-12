import { User } from '../models/index.js';
import AppError from '../utils/AppError.js';
import { comparePassword, hashPassword } from '../utils/password.js';

const profile = (userId) => User.findByPk(userId);

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.unscoped().findByPk(userId);
  if (!(await comparePassword(oldPassword, user.password))) throw new AppError('Old password is incorrect', 406);
  await user.update({ password: await hashPassword(newPassword) });
};

const changeUsername = async (userId, username) => {
  const user = await User.findByPk(userId);
  await user.update({ username });
  return profile(userId);
};

const listUsers = () => User.findAll({ order: [['createdAt', 'DESC']] });
const softDeleteUser = (id) => User.destroy({ where: { id } });

export default {
  profile,
  changePassword,
  changeUsername,
  listUsers,
  softDeleteUser
};
