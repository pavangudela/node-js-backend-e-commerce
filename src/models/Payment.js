import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';
import paymentStatus from '../constants/paymentStatus.js';

class Payment extends Model {}

Payment.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  orderId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  currency: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'INR' },
  razorpayOrderId: { type: DataTypes.STRING, unique: true },
  razorpayPaymentId: { type: DataTypes.STRING, unique: true },
  razorpaySignature: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM(...Object.values(paymentStatus)), allowNull: false, defaultValue: paymentStatus.PENDING },
  webhookEventId: { type: DataTypes.STRING }
}, {
  sequelize,
  modelName: 'Payment',
  tableName: 'payments'
});

export default Payment;
