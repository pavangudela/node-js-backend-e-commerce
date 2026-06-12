import sequelize from '../database/sequelize.js';
import { Address } from '../models/index.js';
import AppError from '../utils/AppError.js';

const list = (userId) => Address.findAll({ where: { userId }, order: [['isDefault', 'DESC'], ['id', 'DESC']] });

const getDefault = async (userId) => {
  const address = await Address.findOne({ where: { userId, isDefault: true } });
  if (!address) throw new AppError('Default address not found', 404);
  return address;
};

const getOwned = async (userId, id) => {
  const address = await Address.findOne({ where: { id, userId } });
  if (!address) throw new AppError('Address not found', 404);
  return address;
};

const create = (userId, payload) => sequelize.transaction(async (transaction) => {
  const count = await Address.count({ where: { userId }, transaction });
  const isDefault = payload.isDefault || count === 0;
  if (isDefault) await Address.update({ isDefault: false }, { where: { userId }, transaction });
  await Address.create({ ...payload, userId, isDefault }, { transaction });
  return list(userId);
});

const update = (userId, id, payload) => sequelize.transaction(async (transaction) => {
  const address = await getOwned(userId, id);
  if (payload.isDefault) await Address.update({ isDefault: false }, { where: { userId }, transaction });
  await address.update(payload, { transaction });
  return list(userId);
});

const remove = (userId, id) => sequelize.transaction(async (transaction) => {
  const address = await getOwned(userId, id);
  const wasDefault = address.isDefault;
  await address.destroy({ transaction });
  if (wasDefault) {
    const replacement = await Address.findOne({ where: { userId }, order: [['id', 'DESC']], transaction });
    if (replacement) await replacement.update({ isDefault: true }, { transaction });
  }
  return list(userId);
});

export default {
  list,
  getDefault,
  getOwned,
  create,
  update,
  remove
};
