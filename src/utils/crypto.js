import { randomBytes, createHash } from 'crypto';

export const randomToken = () => randomBytes(32).toString('hex');
export const hashToken = (token) => createHash('sha256').update(token).digest('hex');

export default {
  randomToken,
  hashToken
};
