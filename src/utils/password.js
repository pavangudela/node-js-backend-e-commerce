import bcrypt from 'bcrypt';
import { bcryptRounds } from '../config/env.js';

export const hashPassword = (password) => bcrypt.hash(password, bcryptRounds);
export const comparePassword = (plain, hashed) => bcrypt.compare(plain, hashed);

export default {
  hashPassword,
  comparePassword
};
