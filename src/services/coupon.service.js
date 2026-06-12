import { Coupon } from '../models/index.js';
import AppError from '../utils/AppError.js';

const normalizeCode = (code) => String(code || '').trim().toUpperCase();

const list = () => Coupon.findAll({ order: [['createdAt', 'DESC']] });

const get = async (id) => {
  const coupon = await Coupon.findByPk(id);
  if (!coupon) throw new AppError('Coupon not found', 404);
  return coupon;
};

const create = (payload) => Coupon.create({ ...payload, code: normalizeCode(payload.code) });

const update = async (id, payload) => {
  const coupon = await get(id);
  await coupon.update({ ...payload, ...(payload.code ? { code: normalizeCode(payload.code) } : {}) });
  return coupon;
};

const remove = async (id) => {
  const coupon = await get(id);
  await coupon.destroy();
};

const calculateDiscount = async (code, subtotal, transaction) => {
  if (!code) return { coupon: null, discountAmount: 0 };
  const coupon = await Coupon.findOne({ where: { code: normalizeCode(code), isActive: true }, transaction, lock: transaction?.LOCK.UPDATE });
  if (!coupon) throw new AppError('Coupon is invalid', 400);

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) throw new AppError('Coupon is not active yet', 400);
  if (coupon.expiresAt && coupon.expiresAt < now) throw new AppError('Coupon has expired', 400);
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new AppError('Coupon usage limit reached', 400);
  if (Number(subtotal) < Number(coupon.minOrderAmount)) throw new AppError('Order total does not meet coupon minimum', 400);

  let discountAmount = coupon.discountType === 'PERCENTAGE'
    ? Number(subtotal) * (Number(coupon.discountValue) / 100)
    : Number(coupon.discountValue);

  if (coupon.maxDiscountAmount) discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
  return { coupon, discountAmount: Math.min(discountAmount, Number(subtotal)) };
};

export default {
  list,
  get,
  create,
  update,
  remove,
  calculateDiscount
};
