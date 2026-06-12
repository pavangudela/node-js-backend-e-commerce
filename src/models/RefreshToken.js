import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class RefreshToken extends Model {}

RefreshToken.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  tokenHash: { type: DataTypes.STRING(128), allowNull: false, unique: true },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  revokedAt: { type: DataTypes.DATE },
  replacedByTokenId: { type: DataTypes.UUID },
  ipAddress: { type: DataTypes.STRING(80) },
  userAgent: { type: DataTypes.STRING(255) }
}, {
  sequelize,
  modelName: 'RefreshToken',
  tableName: 'refresh_tokens',
  paranoid: false
});

export default RefreshToken;
