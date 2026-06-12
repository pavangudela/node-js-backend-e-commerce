import sequelize from '../database/sequelize.js';
import User from './User.js';
import Brand from './Brand.js';
import Category from './Category.js';
import Subcategory from './Subcategory.js';
import Product from './Product.js';
import ProductImage from './ProductImage.js';
import ProductVariant from './ProductVariant.js';
import Address from './Address.js';
import Cart from './Cart.js';
import CartItem from './CartItem.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Payment from './Payment.js';
import WishlistItem from './WishlistItem.js';
import Review from './Review.js';
import Coupon from './Coupon.js';
import CouponRedemption from './CouponRedemption.js';
import RefreshToken from './RefreshToken.js';
import UserToken from './UserToken.js';

User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Brand.hasMany(Product, { foreignKey: 'brandId', as: 'products' });
Product.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });

Category.hasMany(Subcategory, { foreignKey: 'categoryId', as: 'subcategories' });
Subcategory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Subcategory.hasMany(Product, { foreignKey: 'subcategoryId', as: 'products' });
Product.belongsTo(Subcategory, { foreignKey: 'subcategoryId', as: 'subcategory' });

Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'variants' });
ProductVariant.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });
ProductVariant.hasMany(CartItem, { foreignKey: 'variantId', as: 'cartItems' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Address.hasMany(Order, { foreignKey: 'addressId', as: 'orders' });
Order.belongsTo(Address, { foreignKey: 'addressId', as: 'address' });
Coupon.hasMany(Order, { foreignKey: 'couponId', as: 'orders' });
Order.belongsTo(Coupon, { foreignKey: 'couponId', as: 'coupon' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
ProductVariant.hasMany(OrderItem, { foreignKey: 'variantId', as: 'orderItems' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });

Order.hasMany(Payment, { foreignKey: 'orderId', as: 'payments' });
Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

User.hasMany(WishlistItem, { foreignKey: 'userId', as: 'wishlistItems' });
WishlistItem.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Product.hasMany(WishlistItem, { foreignKey: 'productId', as: 'wishlistItems' });
WishlistItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' });
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Coupon.hasMany(CouponRedemption, { foreignKey: 'couponId', as: 'redemptions' });
CouponRedemption.belongsTo(Coupon, { foreignKey: 'couponId', as: 'coupon' });
User.hasMany(CouponRedemption, { foreignKey: 'userId', as: 'couponRedemptions' });
CouponRedemption.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.hasOne(CouponRedemption, { foreignKey: 'orderId', as: 'couponRedemption' });
CouponRedemption.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(UserToken, { foreignKey: 'userId', as: 'tokens' });
UserToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export {
  sequelize,
  User,
  Brand,
  Category,
  Subcategory,
  Product,
  ProductImage,
  ProductVariant,
  Address,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  WishlistItem,
  Review,
  Coupon,
  CouponRedemption,
  RefreshToken,
  UserToken
};

export default {
  sequelize,
  User,
  Brand,
  Category,
  Subcategory,
  Product,
  ProductImage,
  ProductVariant,
  Address,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  WishlistItem,
  Review,
  Coupon,
  CouponRedemption,
  RefreshToken,
  UserToken
};
