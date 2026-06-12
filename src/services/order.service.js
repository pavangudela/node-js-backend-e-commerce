import { Op } from 'sequelize';
import sequelize from '../database/sequelize.js';
import {
  Address,
  Cart,
  CartItem,
  CouponRedemption,
  Order,
  OrderItem,
  Product,
  ProductVariant,
  ProductImage
  
} from '../models/index.js';
import AppError from '../utils/AppError.js';
import orderStatus from '../constants/orderStatus.js';
import couponService from './coupon.service.js';

const orderInclude = [
  {
    model: OrderItem,
    as: 'items',
    include: [
      {
        model: ProductVariant,
        as: 'variant',
        include: [
          {
            model: Product,
            as: 'product',
            include: [
              {
                model: ProductImage,
                as: 'images'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    model: Address,
    as: 'address'
  }
];

const getOrder = async (id, user, transaction) => {
  const where = { id };
  if (user.role !== 'ADMIN') where.userId = user.id;
  const order = await Order.findOne({ where, include: orderInclude, transaction });
  if (!order) throw new AppError('Order not found', 404);
  return order;
};

const checkout = (userId, payload) =>
  sequelize.transaction(async (transaction) => {

    const address = await Address.findOne({
      where: {
        id: payload.addressId,
        userId
      },
      transaction
    });

    if (!address) {
      throw new AppError('Address not found', 404);
    }

    const cart = await Cart.findOne({
      where: { userId },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: ProductVariant,
          as: 'variant',
          include: [{
            model: Product,
            as: 'product'
          }]
        }]
      }],
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!cart || !cart.items.length) {
      throw new AppError('Cart is empty', 400);
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {

      const variant = await ProductVariant.findByPk(
        item.variantId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE
        }
      );

      if (!variant) {
        throw new AppError(
          `Variant ${item.variantId} not found`,
          404
        );
      }

      if (item.variant?.product?.isActive === false) {
        throw new AppError(
          `${item.variant.product.name} is unavailable`,
          400
        );
      }

      if (variant.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for variant ${item.variantId}`,
          409
        );
      }

      await variant.update(
        {
          stock: variant.stock - item.quantity,
          reserveStock:
            (variant.reserveStock || 0) + item.quantity
        },
        { transaction }
      );

      const lineTotal =
        Number(item.unitPrice) * item.quantity;

      subtotal += lineTotal;

      orderItems.push({
        variantId: item.variantId,
        productId: item.variant.productId,
        productName: item.variant.product.name,
        color: item.color,
        size: item.size,
        price: item.unitPrice,
        quantity: item.quantity,
        lineTotal,
        status:
          payload.paymentType === 'COD'
            ? orderStatus.PLACED
            : orderStatus.PENDING
      });
    }

    const {
      coupon,
      discountAmount
    } = await couponService.calculateDiscount(
      payload.couponCode,
      subtotal,
      transaction
    );

    const totalPrice = subtotal - discountAmount;

    const order = await Order.create(
      {
        userId,
        addressId: address.id,
        couponId: coupon?.id || null,
        paymentType: payload.paymentType,
        status:
          payload.paymentType === 'COD'
            ? orderStatus.PLACED
            : orderStatus.PENDING,
        subtotal,
        discountAmount,
        totalPrice
      },
      { transaction }
    );

    await OrderItem.bulkCreate(
      orderItems.map(item => ({
        ...item,
        orderId: order.id
      })),
      { transaction }
    );

    if (coupon) {

      await CouponRedemption.create(
        {
          couponId: coupon.id,
          userId,
          orderId: order.id,
          discountAmount
        },
        { transaction }
      );

      await coupon.increment(
        'usedCount',
        {
          by: 1,
          transaction
        }
      );
    }

    await CartItem.destroy({
      force: true,
      where: {
        cartId: cart.id
      },
      transaction
    });

    await cart.update(
      { subtotal: 0 },
      { transaction }
    );

    return getOrder(
      order.id,
      {
        id: userId,
        role: 'CUSTOMER'
      },
      transaction
    );
  });

const listMine = (userId) => Order.findAll({ where: { userId }, include: orderInclude, order: [['createdAt', 'DESC']] });
const listAll = () => Order.findAll({ include: orderInclude, order: [['createdAt', 'DESC']] });

const updateStatus = async (id, status,transaction) => {
  const order = await Order.findByPk(id, { include: [{ model: OrderItem, as: 'items' }] });
  if (!order) throw new AppError('Order not found', 404);
  await order.update({ status }, { transaction });
  await OrderItem.update({ status }, { where: { orderId: id }, transaction });
  return getOrder(id, { role: 'ADMIN' }, transaction);
};

const updateItemStatus = async (
  orderId,
  itemId,
  status,
  transaction
) => {

  const order = await Order.findByPk(orderId, {
    include: [{ model: OrderItem, as: 'items' }],
    transaction
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const item = order.items.find(
    (row) => Number(row.id) === Number(itemId)
  );

  if (!item) {
    throw new AppError('Order item not found', 404);
  }

  
  if (
  status === orderStatus.CANCELLED &&
  [orderStatus.PENDING, orderStatus.PLACED].includes(item.status)
) {
    const variant = await ProductVariant.findByPk(
      item.variantId,
      {
        transaction,
        lock: transaction.LOCK.UPDATE
      }
    );

    if (!variant) {
      throw new AppError('Product variant not found', 404);
    }

    await variant.update(
      {
        stock: variant.stock + item.quantity,
        reserveStock: Math.max(
          0,
          variant.reserveStock - item.quantity
        )
      },
      { transaction }
    );
  }

  await item.update(
    { status },
    { transaction }
  );

  const remainingItems = await OrderItem.count({
    where: {
      orderId,
      status: {
        [Op.ne]: status
      }
    },
    transaction
  });

  if (remainingItems === 0) {
    await order.update(
      { status },
      { transaction }
    );
  }

  return getOrder(
    orderId,
    { role: 'ADMIN' },
    transaction
  );
};

const cancelItem = async (userId, orderId, itemId) =>
  sequelize.transaction(async (transaction) => {

    const order = await getOrder(
      orderId,
      { id: userId, role: 'CUSTOMER' },
      transaction
    );

    const item = await OrderItem.findOne({
      where: { id: itemId, orderId },
      transaction
    });

    if (!item) {
      throw new AppError('Order item not found', 404);
    }

    if (
      [
        orderStatus.DELIVERED,
        orderStatus.RETURNED,
        orderStatus.REFUNDED,
        orderStatus.CANCELLED
      ].includes(item.status)
    ) {
      throw new AppError(
        `Cannot cancel item with status ${item.status}`,
        400
      );
    }

    const variant = await ProductVariant.findByPk(
      item.variantId,
      {
        transaction,
        lock: transaction.LOCK.UPDATE
      }
    );

    if (!variant) {
      throw new AppError('Product variant not found', 404);
    }

  
    await variant.update(
      {
        stock: variant.stock + item.quantity,
        reserveStock: Math.max(
          0,
          variant.reserveStock - item.quantity
        )
      },
      { transaction }
    );

    await item.update(
      { status: orderStatus.CANCELLED },
      { transaction }
    );

    const activeCount = await OrderItem.count({
      where: {
        orderId,
        status: {
          [Op.notIn]: [orderStatus.CANCELLED]
        }
      },
      transaction
    });

    if (!activeCount) {
      await order.update(
        { status: orderStatus.CANCELLED },
        { transaction }
      );
    }

    return getOrder(
      orderId,
      { id: userId, role: 'CUSTOMER' },
      transaction
    );
  });

export default {
  checkout,
  listMine,
  listAll,
  getOrder,
  updateStatus,
  updateItemStatus,
  cancelItem
};
