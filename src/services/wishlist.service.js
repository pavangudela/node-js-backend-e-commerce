import { Product, ProductImage, WishlistItem } from '../models/index.js';

const list = (userId) => WishlistItem.findAll({
  where: { userId },
  include: [{ model: Product, as: 'product', include: [{ model: ProductImage, as: 'images' }] }],
  order: [['createdAt', 'DESC']]
});

const add = async (userId, productId) => {
  await WishlistItem.findOrCreate({ where: { userId, productId } });
  return list(userId);
};

const remove = async (userId, productId) => {
  await WishlistItem.destroy({ force: true, where: { userId, productId } });
  return list(userId);
};

export default { list, add, remove };
