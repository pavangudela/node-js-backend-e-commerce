import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';
import roles from '../constants/roles.js';

class User extends Model {}

User.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(180), allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM(...Object.values(roles)), allowNull: false, defaultValue: roles.CUSTOMER },
  isEmailVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, 
   },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  lastLoginAt: { type: DataTypes.DATE }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  scopes: {
    withPassword: { attributes: {} }
  }
});

export default User;
