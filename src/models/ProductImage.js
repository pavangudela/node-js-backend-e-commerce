import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class ProductImage extends Model {}

ProductImage.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  imageUrl: { type: DataTypes.STRING, allowNull: false },
  publicId: { type: DataTypes.STRING },
  color: { type: DataTypes.STRING(80) },
  isPrimary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  sortOrder: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 }
}, {
  sequelize,
  modelName: 'ProductImage',
  tableName: 'product_images'
});

export default ProductImage;
