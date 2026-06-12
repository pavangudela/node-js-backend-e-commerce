# Database Analysis

Source files: `src/models/**`, `src/models/index.js`, `src/migrations/20260529000100-create-commerce-schema.js`.

## Tables And Columns

| Table | Model | Columns |
|---|---|---|
| `users` | `User` | `id`, `username`, `email`, `password`, `role`, `is_email_verified`, `is_active`, `last_login_at`, timestamps, `deleted_at` |
| `brands` | `Brand` | `id`, `name`, `slug`, `description`, `logo_url`, `logo_public_id`, `is_active`, timestamps, `deleted_at` |
| `categories` | `Category` | `id`, `name`, `slug`, `description`, `is_active`, timestamps, `deleted_at` |
| `subcategories` | `Subcategory` | `id`, `category_id`, `name`, `slug`, `description`, `is_active`, timestamps, `deleted_at` |
| `products` | `Product` | `id`, `brand_id`, `category_id`, `subcategory_id`, `name`, `slug`, `description`, `price`, `compare_at_price`, `material`, `fit`, `pattern`, `sizes`, `colors`, `average_rating`, `total_reviews`, `is_active`, timestamps, `deleted_at` |
| `product_images` | `ProductImage` | `id`, `product_id`, `image_url`, `public_id`, `color`, `is_primary`, `sort_order`, timestamps, `deleted_at` |
| `product_variants` | `ProductVariant` | `id`, `product_id`, `sku`, `color`, `size`, `stock`, `reserved_stock`, `is_active`, timestamps, `deleted_at` |
| `addresses` | `Address` | `id`, `user_id`, `name`, `contact_number`, `pin_code`, `state`, `area`, `land_mark`, `building_name`, `is_default`, timestamps, `deleted_at` |
| `carts` | `Cart` | `id`, `user_id`, `subtotal`, timestamps, `deleted_at` |
| `cart_items` | `CartItem` | `id`, `cart_id`, `variant_id`, `size`, `color`, `unit_price`, `quantity`, timestamps, `deleted_at` |
| `coupons` | `Coupon` | `id`, `code`, `description`, `discount_type`, `discount_value`, `max_discount_amount`, `min_order_amount`, `usage_limit`, `used_count`, `starts_at`, `expires_at`, `is_active`, timestamps, `deleted_at` |
| `orders` | `Order` | `id`, `user_id`, `address_id`, `coupon_id`, `status`, `payment_type`, `subtotal`, `discount_amount`, `total_price`, `razorpay_order_id`, `shipping_status`, `tracking_number`, timestamps, `deleted_at` |
| `order_items` | `OrderItem` | `id`, `order_id`, `variant_id`, `product_id`, `product_name`, `color`, `size`, `price`, `quantity`, `line_total`, `status`, timestamps, `deleted_at` |
| `payments` | `Payment` | `id`, `order_id`, `amount`, `currency`, `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`, `status`, `webhook_event_id`, timestamps, `deleted_at` |
| `wishlist_items` | `WishlistItem` | `id`, `user_id`, `product_id`, timestamps, `deleted_at` |
| `reviews` | `Review` | `id`, `user_id`, `product_id`, `rating`, `title`, `comment`, `is_approved`, timestamps, `deleted_at` |
| `coupon_redemptions` | `CouponRedemption` | `id`, `coupon_id`, `user_id`, `order_id`, `discount_amount`, timestamps, `deleted_at` |
| `refresh_tokens` | `RefreshToken` | `id`, `user_id`, `token_hash`, `expires_at`, `revoked_at`, `replaced_by_token_id`, `ip_address`, `user_agent`, timestamps |
| `user_tokens` | `UserToken` | `id`, `user_id`, `token_hash`, `type`, `expires_at`, `consumed_at`, timestamps |

## Foreign Keys And Relationships

Total Sequelize association declarations found: 52, representing 26 relationship pairs.

| Relationship | Association |
|---|---|
| `users` 1:1 `carts` | `User.hasOne(Cart)`, `Cart.belongsTo(User)` |
| `users` 1:N `addresses` | `User.hasMany(Address)`, `Address.belongsTo(User)` |
| `brands` 1:N `products` | `Brand.hasMany(Product)`, `Product.belongsTo(Brand)` |
| `categories` 1:N `subcategories` | `Category.hasMany(Subcategory)`, `Subcategory.belongsTo(Category)` |
| `categories` 1:N `products` | `Category.hasMany(Product)`, `Product.belongsTo(Category)` |
| `subcategories` 1:N `products` | `Subcategory.hasMany(Product)`, `Product.belongsTo(Subcategory)` |
| `products` 1:N `product_images` | `Product.hasMany(ProductImage)`, `ProductImage.belongsTo(Product)` |
| `products` 1:N `product_variants` | `Product.hasMany(ProductVariant)`, `ProductVariant.belongsTo(Product)` |
| `carts` 1:N `cart_items` | `Cart.hasMany(CartItem)`, `CartItem.belongsTo(Cart)` |
| `product_variants` 1:N `cart_items` | `ProductVariant.hasMany(CartItem)`, `CartItem.belongsTo(ProductVariant)` |
| `users` 1:N `orders` | `User.hasMany(Order)`, `Order.belongsTo(User)` |
| `addresses` 1:N `orders` | `Address.hasMany(Order)`, `Order.belongsTo(Address)` |
| `coupons` 1:N `orders` | `Coupon.hasMany(Order)`, `Order.belongsTo(Coupon)` |
| `orders` 1:N `order_items` | `Order.hasMany(OrderItem)`, `OrderItem.belongsTo(Order)` |
| `products` 1:N `order_items` | `Product.hasMany(OrderItem)`, `OrderItem.belongsTo(Product)` |
| `product_variants` 1:N `order_items` | `ProductVariant.hasMany(OrderItem)`, `OrderItem.belongsTo(ProductVariant)` |
| `orders` 1:N `payments` | `Order.hasMany(Payment)`, `Payment.belongsTo(Order)` |
| `users` 1:N `wishlist_items` | `User.hasMany(WishlistItem)`, `WishlistItem.belongsTo(User)` |
| `products` 1:N `wishlist_items` | `Product.hasMany(WishlistItem)`, `WishlistItem.belongsTo(Product)` |
| `users` 1:N `reviews` | `User.hasMany(Review)`, `Review.belongsTo(User)` |
| `products` 1:N `reviews` | `Product.hasMany(Review)`, `Review.belongsTo(Product)` |
| `coupons` 1:N `coupon_redemptions` | `Coupon.hasMany(CouponRedemption)`, `CouponRedemption.belongsTo(Coupon)` |
| `users` 1:N `coupon_redemptions` | `User.hasMany(CouponRedemption)`, `CouponRedemption.belongsTo(User)` |
| `orders` 1:1 `coupon_redemptions` | `Order.hasOne(CouponRedemption)`, `CouponRedemption.belongsTo(Order)` |
| `users` 1:N `refresh_tokens` | `User.hasMany(RefreshToken)`, `RefreshToken.belongsTo(User)` |
| `users` 1:N `user_tokens` | `User.hasMany(UserToken)`, `UserToken.belongsTo(User)` |

## Constraints

| Table | Constraint |
|---|---|
| `users` | unique `email`; enum `role` |
| `brands` | unique `name`, unique `slug` |
| `categories` | unique `name`, unique `slug` |
| `subcategories` | unique composite `category_id`, `slug` |
| `products` | unique `slug` |
| `product_variants` | unique `sku`; unique composite `product_id`, `color`, `size` |
| `carts` | unique `user_id` |
| `cart_items` | unique composite `cart_id`, `variant_id` |
| `coupons` | unique `code`; enum `discount_type` |
| `orders` | enum `status`; enum `payment_type` |
| `order_items` | enum `status` |
| `payments` | unique `razorpay_order_id`; unique `razorpay_payment_id`; enum `status` |
| `wishlist_items` | unique composite `user_id`, `product_id` |
| `reviews` | unique composite `user_id`, `product_id` |
| `coupon_redemptions` | unique composite `coupon_id`, `order_id` |
| `refresh_tokens` | unique `token_hash` |
| `user_tokens` | unique `token_hash`; enum `type` |

## Indexes

Explicit indexes:

- `subcategories(category_id, slug)` unique
- `products(slug)`
- `products(brand_id)`
- `products(category_id)`
- `products(subcategory_id)`
- `products(price)`
- `product_variants(product_id, color, size)` unique
- `cart_items(cart_id, variant_id)` unique
- `wishlist_items(user_id, product_id)` unique
- `reviews(user_id, product_id)` unique
- `coupon_redemptions(coupon_id, order_id)` unique

Implicit unique indexes also exist on unique columns such as `users.email`, `brands.slug`, `coupons.code`.

## Soft Deletes

Sequelize global define has `paranoid: true`. All commerce models inherit soft deletes unless they explicitly set `paranoid: false`.

Paranoid models: `User`, `Brand`, `Category`, `Subcategory`, `Product`, `ProductImage`, `ProductVariant`, `Address`, `Cart`, `CartItem`, `Order`, `OrderItem`, `Payment`, `WishlistItem`, `Review`, `Coupon`, `CouponRedemption`.

Non-paranoid token models: `RefreshToken`, `UserToken`.

## ER Diagram

```text
Users
|-- Cart
|   |-- CartItems
|       |-- ProductVariants
|           |-- Products
|-- Addresses
|-- Orders
|   |-- OrderItems
|   |   |-- Products
|   |   |-- ProductVariants
|   |-- Payments
|   |-- CouponRedemption
|-- WishlistItems
|   |-- Products
|-- Reviews
|   |-- Products
|-- RefreshTokens
|-- UserTokens

Brands
|-- Products

Categories
|-- Subcategories
|   |-- Products
|-- Products

Products
|-- ProductImages
|-- ProductVariants
|-- Reviews
|-- WishlistItems
|-- OrderItems

Coupons
|-- Orders
|-- CouponRedemptions
```

## Migration Notes

- The model layer and migration mostly align on snake_case columns through Sequelize `underscored: true`.
- `server.js` currently calls `sequelize.sync()` before `authenticate()`. For migration-driven production usage, remove `sync()` and rely on `sequelize-cli db:migrate`.
- Sequelize CLI may need ESM-aware configuration because the codebase uses `import/export`; see `CODE_REVIEW.md`.
