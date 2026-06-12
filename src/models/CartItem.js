import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class CartItem extends Model {}

CartItem.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  cartId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  variantId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  size: { type: DataTypes.STRING(80), allowNull: false },
  color: { type: DataTypes.STRING(80), allowNull: false },
  unitPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 }
}, {
  sequelize,
  modelName: 'CartItem',
  tableName: 'cart_items',
  indexes: [{ unique: true, fields: ['cart_id', 'variant_id'] }]
});

export default CartItem;
