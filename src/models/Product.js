import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Product extends Model {}

Product.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  brandId: { type: DataTypes.BIGINT.UNSIGNED },
  categoryId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  subcategoryId: { type: DataTypes.BIGINT.UNSIGNED },
  name: { type: DataTypes.STRING(180), allowNull: false },
  slug: { type: DataTypes.STRING(220), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  compareAtPrice: { type: DataTypes.DECIMAL(12, 2) },
  material: { type: DataTypes.STRING(120) },
  fit: { type: DataTypes.STRING(120) },
  pattern: { type: DataTypes.STRING(120) },
  sizes: { type: DataTypes.JSON },
  colors: { type: DataTypes.JSON },
  averageRating: { type: DataTypes.DECIMAL(3, 2), allowNull: false, defaultValue: 0 },
  totalReviews: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products',
  indexes: [
    { fields: ['slug'] },
    { fields: ['brand_id'] },
    { fields: ['category_id'] },
    { fields: ['subcategory_id'] },
    { fields: ['price'] }
  ]
});

export default Product;
