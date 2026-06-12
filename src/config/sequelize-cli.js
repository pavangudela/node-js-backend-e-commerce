import { db } from './env.js';

export const development = {
  username: db.user,
  password: db.password,
  database: db.name,
  host: db.host,
  port: db.port,
  dialect: db.dialect
};
export const test = {
  username: db.user,
  password: db.password,
  database: `${db.name}_test`,
  host: db.host,
  port: db.port,
  dialect: db.dialect,
  logging: false
};
export const production = {
  username: db.user,
  password: db.password,
  database: db.name,
  host: db.host,
  port: db.port,
  dialect: db.dialect,
  logging: false
};

export default {
  development,
  test,
  production
};
