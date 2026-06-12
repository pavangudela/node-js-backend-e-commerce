import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Cart extends Model {}

Cart.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, unique: true },
  subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 }
}, {
  sequelize,
  modelName: 'Cart',
  tableName: 'carts'
});

export default Cart;
