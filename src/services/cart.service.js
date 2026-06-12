import sequelize from '../database/sequelize.js';
import { Cart, CartItem, Product, ProductVariant, ProductImage } from '../models/index.js';
import AppError from '../utils/AppError.js';

const MAX_QTY_PER_ITEM = 10;

const getOrCreateCart = async (userId, transaction) => {
  const [cart] = await Cart.findOrCreate({ where: { userId }, defaults: { subtotal: 0 }, transaction });
  return cart;
};

const recalcCart = async (cart, transaction) => {
  const items = await CartItem.findAll({ where: { cartId: cart.id }, transaction });
  const subtotal = items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
  await cart.update({ subtotal }, { transaction });
};

const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  return Cart.findByPk(cart.id, {
    include: [{
      model: CartItem,
      as: 'items',
      include: [{
        model: ProductVariant,
        as: 'variant',
        include: [{ model: Product, as: 'product', include: [{ model: ProductImage, as: 'images' }] }]
      }]
    }]
  });
};

const addItem = (userId, payload) => sequelize.transaction(async (transaction) => {
  const cart = await getOrCreateCart(userId, transaction);
  const variant = await ProductVariant.findByPk(payload.variantId, {
    include: [{ model: Product, as: 'product' }],
    transaction,
    lock: transaction.LOCK.UPDATE
  });
  if (!variant || !variant.isActive || !variant.product?.isActive) throw new AppError('Variant is not available', 404);
  if (Number(variant.productId) !== Number(payload.productId)) throw new AppError('Variant does not belong to product', 400);
  const allowed = Math.min(variant.stock, MAX_QTY_PER_ITEM);
  if (allowed < 1) throw new AppError('Variant is out of stock', 409);

  const [item, created] = await CartItem.findOrCreate({
    where: { cartId: cart.id, variantId: variant.id },
    defaults: {
      cartId: cart.id,
      variantId: variant.id,
      color: variant.color,
      size: variant.size,
      quantity: Math.min(payload.qty, allowed),
      unitPrice: variant.product.price
    },
    transaction
  });
  if (!created) {
    await item.update({ quantity: Math.min(payload.qty, allowed), unitPrice: variant.product.price }, { transaction });
  }
  await  recalcCart(cart, transaction);
  
  return   getCart(userId);
});

const updateItem = (userId, payload) => sequelize.transaction(async (transaction) => {
  const cart = await getOrCreateCart(userId, transaction);
  const item = await CartItem.findOne({ where: { cartId: cart.id, variantId: payload.variantId }, transaction });
  if (!item) throw new AppError('Cart item not found', 404);
  if (payload.qty === 0) await item.destroy({ transaction });
  else {
    const variant = await ProductVariant.findByPk(payload.variantId, { transaction, lock: transaction.LOCK.UPDATE });
    await item.update({ quantity: Math.min(payload.qty, variant.stock, MAX_QTY_PER_ITEM) }, { transaction });
  }
  await recalcCart(cart, transaction);
  return getCart(userId);
});

const removeItem = (userId, variantId) => sequelize.transaction(async (transaction) => {
  const cart = await getOrCreateCart(userId, transaction);
  const item = await CartItem.findOne({ where: { cartId: cart.id, variantId }, transaction });
  if (!item) throw new AppError('Cart item not found', 404);
  await item.destroy({force: true, transaction });
  await recalcCart(cart, transaction);
  return getCart(userId);
});

const clear = async (userId) => {
  const cart = await getOrCreateCart(userId);
  await CartItem.destroy({force: true, where: { cartId: cart.id } });
  await cart.update({ subtotal: 0 });
};

export default {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clear
};
