import AppError from '../utils/AppError.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { User } from '../models/index.js';

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError('Authentication token is required', 401);
    }

    const payload = verifyAccessToken(header.slice(7));
    const user = await User.findByPk(payload.id);
    if (!user || !user.isActive) {
      throw new AppError('User account is not active', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
      isEmailVerified: user.isEmailVerified
    };
    next();
  } catch (error) {
    next(error.statusCode ? error : new AppError('Invalid or expired token', 401));
  }
};

export default authenticate;
