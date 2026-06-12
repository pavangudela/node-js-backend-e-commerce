import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';
import tokenTypes from '../constants/tokenTypes.js';

class UserToken extends Model {}

UserToken.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  tokenHash: { type: DataTypes.STRING(128), allowNull: false, unique: true },
  type: { type: DataTypes.ENUM(...Object.values(tokenTypes)), allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  consumedAt: { type: DataTypes.DATE }
}, {
  sequelize,
  modelName: 'UserToken',
  tableName: 'user_tokens',
  paranoid: false
});

export default UserToken;
