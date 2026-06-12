import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Subcategory extends Model {}

Subcategory.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  categoryId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  name: { type: DataTypes.STRING(140), allowNull: false },
  slug: { type: DataTypes.STRING(170), allowNull: false },
  description: { type: DataTypes.TEXT },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
  sequelize,
  modelName: 'Subcategory',
  tableName: 'subcategories',
  indexes: [{ unique: true, fields: ['category_id', 'slug'] }]
});

export default Subcategory;
