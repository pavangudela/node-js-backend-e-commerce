import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class ProductVariant extends Model {}

ProductVariant.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  sku: { type: DataTypes.STRING(120), unique: true },
  color: { type: DataTypes.STRING(80), allowNull: false },
  size: { type: DataTypes.STRING(80), allowNull: false },
  stock: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  reservedStock: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
  sequelize,
  modelName: 'ProductVariant',
  tableName: 'product_variants',
  indexes: [{ unique: true, fields: ['product_id', 'color', 'size'] }]
});

export default ProductVariant;
