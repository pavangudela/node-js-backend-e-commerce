import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Address extends Model {}

Address.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  name: { type: DataTypes.STRING(140), allowNull: false },
  contactNumber: { type: DataTypes.STRING(30), allowNull: false },
  pinCode: { type: DataTypes.STRING(20), allowNull: false },
  state: { type: DataTypes.STRING(120), allowNull: false },
  area: { type: DataTypes.STRING(180), allowNull: false },
  landMark: { type: DataTypes.STRING(180) },
  buildingName: { type: DataTypes.STRING(180) },
  isDefault: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
  sequelize,
  modelName: 'Address',
  tableName: 'addresses'
});

export default Address;
