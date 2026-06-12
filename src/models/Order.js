import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';
import orderStatus from '../constants/orderStatus.js';

class Order extends Model {}

Order.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  addressId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  couponId: { type: DataTypes.BIGINT.UNSIGNED },
  status: { type: DataTypes.ENUM(...Object.values(orderStatus)), allowNull: false, defaultValue: orderStatus.PENDING },
  paymentType: { type: DataTypes.ENUM('COD', 'RAZORPAY'), allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  discountAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  totalPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  razorpayOrderId: { type: DataTypes.STRING },
  shippingStatus: { type: DataTypes.STRING(80) },
  trackingNumber: { type: DataTypes.STRING(160) }
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders'
});

export default Order;
