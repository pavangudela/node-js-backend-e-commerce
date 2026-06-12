import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Review extends Model {}

Review.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  rating: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, validate: { min: 1, max: 5 } },
  title: { type: DataTypes.STRING(160) },
  comment: { type: DataTypes.TEXT },
  isApproved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
  sequelize,
  modelName: 'Review',
  tableName: 'reviews',
  indexes: [{ unique: true, fields: ['user_id', 'product_id'] }]
});

export default Review;
