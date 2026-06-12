import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Coupon extends Model {}

Coupon.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING(60), allowNull: false, unique: true },
  description: { type: DataTypes.STRING(255) },
  discountType: { type: DataTypes.ENUM('PERCENTAGE', 'FIXED'), allowNull: false },
  discountValue: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  maxDiscountAmount: { type: DataTypes.DECIMAL(12, 2) },
  minOrderAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  usageLimit: { type: DataTypes.INTEGER.UNSIGNED },
  usedCount: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  startsAt: { type: DataTypes.DATE },
  expiresAt: { type: DataTypes.DATE },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
  sequelize,
  modelName: 'Coupon',
  tableName: 'coupons'
});

export default Coupon;
