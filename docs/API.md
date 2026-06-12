# Production E-Commerce API

Base URL: `/api`

All protected endpoints require:

```http
Authorization: Bearer <accessToken>
```

## Auth

| Method | Path | Access | Purpose |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register customer, send email verification, issue access/refresh tokens |
| `POST` | `/auth/login` | Public | Login with email/password |
| `POST` | `/auth/refresh` | Public | Rotate refresh token and issue new tokens |
| `POST` | `/auth/logout` | Public | Revoke refresh token |
| `POST` | `/auth/forgot-password` | Public | Send reset-password link |
| `POST` | `/auth/reset-password` | Public | Reset password with token |
| `POST` | `/auth/verify-email` | Public | Verify email with token |

## Catalog

| Method | Path | Access | Purpose |
|---|---|---|---|
| `GET` | `/catalog/brands?q=&page=&limit=` | Public | Brand search |
| `POST` | `/catalog/brands` | Admin | Create brand |
| `PUT` | `/catalog/brands/:id` | Admin | Update brand |
| `DELETE` | `/catalog/brands/:id` | Admin | Soft-delete brand |
| `GET` | `/catalog/categories?q=&page=&limit=` | Public | Category search |
| `POST` | `/catalog/categories` | Admin | Create category |
| `PUT` | `/catalog/categories/:id` | Admin | Update category |
| `DELETE` | `/catalog/categories/:id` | Admin | Soft-delete category |
| `GET` | `/catalog/subcategories?q=&page=&limit=` | Public | Subcategory search with category |
| `POST` | `/catalog/subcategories` | Admin | Create subcategory under category |
| `PUT` | `/catalog/subcategories/:id` | Admin | Update subcategory |
| `DELETE` | `/catalog/subcategories/:id` | Admin | Soft-delete subcategory |

## Products

| Method | Path | Access | Purpose |
|---|---|---|---|
| `GET` | `/products?q=&brandId=&categoryId=&subcategoryId=&minPrice=&maxPrice=&sort=&page=&limit=` | Public | Advanced product search |
| `GET` | `/products/:id` | Public | Product details with brand/category/images/variants |
| `POST` | `/products` | Admin | Create product, variants, images |
| `PUT` | `/products/:id` | Admin | Update product, images, variants |
| `DELETE` | `/products/:id` | Admin | Soft-delete product |
| `GET` | `/products/:productId/reviews` | Public | Product reviews |
| `POST` | `/products/:productId/reviews` | Customer | Create/update own review |
| `DELETE` | `/products/:productId/reviews/me` | Customer | Delete own review |

Supported sorting: `newest`, `price_asc`, `price_desc`, `rating_desc`, `name_asc`.

## Customer Shop

| Method | Path | Access | Purpose |
|---|---|---|---|
| `GET` | `/shop/addresses` | Auth | List addresses |
| `GET` | `/shop/addresses/default` | Auth | Get default address |
| `POST` | `/shop/addresses` | Auth | Create address |
| `PUT` | `/shop/addresses/:id` | Auth | Update address |
| `DELETE` | `/shop/addresses/:id` | Auth | Soft-delete address |
| `GET` | `/shop/cart` | Customer | Get cart |
| `POST` | `/shop/cart/items` | Customer | Add item with stock validation |
| `PATCH` | `/shop/cart/items` | Customer | Update item quantity |
| `DELETE` | `/shop/cart/items/:variantId` | Customer | Remove one cart item |
| `DELETE` | `/shop/cart` | Customer | Clear cart |
| `POST` | `/shop/orders` | Customer | Transactional checkout with coupon and stock protection |
| `GET` | `/shop/orders/my` | Customer | My orders |
| `GET` | `/shop/orders/:id` | Auth | Get order; customers only see own orders |
| `POST` | `/shop/orders/:orderId/items/:itemId/cancel` | Customer | Cancel order item |
| `GET` | `/shop/orders` | Admin | All orders |
| `PATCH` | `/shop/orders/:id/status` | Admin | Update whole order status |
| `PATCH` | `/shop/orders/:orderId/items/:itemId/status` | Admin | Update one order item status |
| `GET` | `/shop/wishlist` | Customer | Wishlist |
| `POST` | `/shop/wishlist/:productId` | Customer | Add product to wishlist |
| `DELETE` | `/shop/wishlist/:productId` | Customer | Remove product from wishlist |

## Payments

| Method | Path | Access | Purpose |
|---|---|---|---|
| `POST` | `/shop/payments/razorpay/:orderId` | Customer | Create Razorpay order |
| `POST` | `/shop/payments/verify` | Customer | Verify Razorpay payment signature |
| `POST` | `/payments/webhook` | Razorpay | Raw-body webhook signature verification |

## Admin

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/admin/dashboard` | Metrics: users, products, orders, revenue, pending reviews, low stock |
| `GET` | `/admin/users` | List users |
| `DELETE` | `/admin/users/:id` | Soft-delete user |
| `GET` | `/admin/coupons` | List coupons |
| `POST` | `/admin/coupons` | Create coupon |
| `PUT` | `/admin/coupons/:id` | Update coupon |
| `DELETE` | `/admin/coupons/:id` | Soft-delete coupon |
| `POST` | `/admin/uploads/product-images` | Upload product image to Cloudinary, form field `image` |
| `POST` | `/admin/uploads/brand-logos` | Upload brand logo to Cloudinary, form field `image` |

## Checkout Guarantees

- Checkout runs inside a Sequelize transaction.
- Product variants are locked during checkout.
- Stock is validated before order creation.
- Stock is decremented atomically before cart clearing.
- Coupon usage is updated in the same transaction as order creation.

## Soft Deletes

All commerce models use Sequelize `paranoid` soft deletes except token tables. Delete endpoints call `destroy()` so rows receive `deleted_at` instead of being physically removed.
