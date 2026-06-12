import { Sequelize } from 'sequelize';
import { db, nodeEnv } from '../config/env.js';
import logger from '../utils/logger.js';

const sequelize = new Sequelize(db.name, db.user, db.password, {
  host: db.host,
  port: db.port,
  dialect: db.dialect,
  logging: nodeEnv === 'development' ? (msg) => logger.debug(msg) : false,
  define: {
    underscored: true,
    paranoid: true,
    timestamps: true
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
