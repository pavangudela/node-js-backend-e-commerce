import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';
import orderStatus from '../constants/orderStatus.js';

class OrderItem extends Model {}

OrderItem.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  orderId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  variantId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  productName: { type: DataTypes.STRING(180), allowNull: false },
  color: { type: DataTypes.STRING(80), allowNull: false },
  size: { type: DataTypes.STRING(80), allowNull: false },
  price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  lineTotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  status: { type: DataTypes.ENUM(...Object.values(orderStatus)), allowNull: false, defaultValue: orderStatus.PENDING }
}, {
  sequelize,
  modelName: 'OrderItem',
  tableName: 'order_items'
});

export default OrderItem;
