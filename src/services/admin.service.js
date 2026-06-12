import { Op } from 'sequelize';
import { Order, Payment, Product, ProductVariant, Review, User } from '../models/index.js';

const dashboard = async () => {
  const [users, products, orders, revenue, pendingReviews, lowStock] = await Promise.all([
    User.count(),
    Product.count(),
    Order.count(),
    Payment.sum('amount', { where: { status: 'SUCCESS' } }),
    Review.count({ where: { isApproved: false } }),
    ProductVariant.findAll({ where: { stock: { [Op.lte]: 5 } }, limit: 20, order: [['stock', 'ASC']] })
  ]);

  return {
    users,
    products,
    orders,
    revenue: Number(revenue || 0),
    pendingReviews,
    lowStock
  };
};

export default { dashboard };
