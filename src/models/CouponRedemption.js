import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class CouponRedemption extends Model {}

CouponRedemption.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  couponId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  orderId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  discountAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false }
}, {
  sequelize,
  modelName: 'CouponRedemption',
  tableName: 'coupon_redemptions',
  indexes: [{ unique: true, fields: ['coupon_id', 'order_id'] }]
});

export default CouponRedemption;
