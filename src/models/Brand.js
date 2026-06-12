import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Brand extends Model {}

Brand.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(140), allowNull: false, unique: true },
  slug: { type: DataTypes.STRING(170), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
  logoUrl: { type: DataTypes.STRING },
  logoPublicId: { type: DataTypes.STRING },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
  sequelize,
  modelName: 'Brand',
  tableName: 'brands'
});

export default Brand;
