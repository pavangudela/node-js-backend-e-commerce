import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class WishlistItem extends Model {}

WishlistItem.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false }
}, {
  sequelize,
  modelName: 'WishlistItem',
  tableName: 'wishlist_items',
  indexes: [{ unique: true, fields: ['user_id', 'product_id'] }]
});

export default WishlistItem;
