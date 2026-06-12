# API Documentation

Source of truth: `src/app.js`, `src/routes/**`, `src/controllers/**`, `src/services/**`, `src/validations/**`.

Base URL: `{{baseUrl}}/api`

Common protected header:

```http
Authorization: Bearer {{accessToken}}
```

Standard success envelope:

```json
{ "success": true, "data": {} }
```

Standard error envelope from `src/middlewares/error.middleware.js`:

```json
{
  "success": false,
  "error": "Validation failed",
  "details": ["\"email\" must be a valid email"],
  "path": "/api/auth/login",
  "timestamp": "2026-06-01T00:00:00.000Z"
}
```

## Project Overview

Architecture: Express application with route modules, thin controllers, service-layer business logic, Joi request validation, Sequelize models/associations, MySQL migrations, JWT authentication, role authorization, bcrypt password hashing, Cloudinary upload integration, Razorpay payment integration, Winston logging, Helmet, CORS, compression, and global rate limiting.

Folder structure:

| Folder | Purpose |
|---|---|
| `src/config` | Environment and Sequelize CLI config |
| `src/database` | Sequelize connection |
| `src/models` | Sequelize models and associations |
| `src/controllers` | HTTP handlers |
| `src/services` | Business logic and transactions |
| `src/routes` | Express route registration |
| `src/middlewares` | Auth, role, validation, upload, error handling |
| `src/validations` | Joi schemas |
| `src/utils` | JWT, password, crypto, email, Cloudinary, logging |
| `src/migrations` | MySQL schema migration |
| `src/seeders` | Admin user seed |

Authentication flow:

1. `POST /api/auth/register` creates a customer, hashes password with bcrypt, creates an email verification token, attempts email delivery, and returns access/refresh tokens.
2. `POST /api/auth/login` validates credentials and returns access/refresh tokens.
3. Protected routes use `authenticate`, which verifies `Authorization: Bearer <token>`, loads `User`, and attaches `req.user`.
4. `POST /api/auth/refresh` rotates refresh tokens using persisted `RefreshToken` rows.
5. `POST /api/auth/logout` revokes the refresh token.

Authorization flow:

Role checks use `authorize(...roles)` middleware. Roles are `ADMIN` and `CUSTOMER`. Admin endpoints use `authorize(roles.ADMIN)`. Customer-only cart, order, wishlist, and review mutation endpoints use `authorize(roles.CUSTOMER)`.

Third-party integrations:

| Integration | Files | Purpose |
|---|---|---|
| Razorpay | `src/services/payment.service.js`, `src/app.js` | Payment order creation, signature verification, raw webhook handling |
| Cloudinary | `src/utils/cloudinary.js`, `src/services/upload.service.js` | Image upload for products and brand logos |
| Nodemailer | `src/utils/email.js` | Verification and password reset emails |

## Endpoint Inventory

Total API endpoints found: 68. Root non-API route: `GET /`.

### Auth

| Method | Route | Controller | Service | Middleware Chain | Access |
|---|---|---|---|---|---|
| POST | `/api/auth/register` | `auth.controller.register` | `auth.service.register` | `validate(register)` | Public |
| POST | `/api/auth/login` | `auth.controller.login` | `auth.service.login` | `validate(login)` | Public |
| POST | `/api/auth/refresh` | `auth.controller.refresh` | `auth.service.refresh` | `validate(refresh)` | Public |
| POST | `/api/auth/logout` | `auth.controller.logout` | `auth.service.logout` | `validate(refresh)` | Public |
| POST | `/api/auth/forgot-password` | `auth.controller.forgotPassword` | `auth.service.forgotPassword` | `validate(forgotPassword)` | Public |
| POST | `/api/auth/reset-password` | `auth.controller.resetPassword` | `auth.service.resetPassword` | `validate(resetPassword)` | Public |
| POST | `/api/auth/verify-email` | `auth.controller.verifyEmail` | `auth.service.verifyEmail` | `validate(verifyEmail)` | Public |

Auth request schemas:

```json
{
  "register": { "username": "Pavan Kumar", "email": "pavan@example.com", "password": "Password@123" },
  "login": { "email": "pavan@example.com", "password": "Password@123" },
  "refreshOrLogout": { "refreshToken": "{{refreshToken}}" },
  "forgotPassword": { "email": "pavan@example.com" },
  "resetPassword": { "token": "reset-token", "password": "NewPassword@123" },
  "verifyEmail": { "token": "verification-token" }
}
```

Validation rules: `username` 2-120 chars; `email` valid email; `password` 8-72 chars; token fields required.

Success examples:

```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "username": "Pavan Kumar", "email": "pavan@example.com", "role": "CUSTOMER", "isEmailVerified": false },
    "accessToken": "jwt",
    "refreshToken": "jwt"
  }
}
```

### Catalog: Brands, Categories, Subcategories

| Method | Route | Controller | Service | Middleware Chain | Access |
|---|---|---|---|---|---|
| GET | `/api/catalog/brands?q=&page=&limit=` | `catalog.controller.brand.list` | `catalog.service.brand.list` | `validate(search, query)` | Public |
| GET | `/api/catalog/brands/:id` | `catalog.controller.brand.get` | `catalog.service.brand.get` | None | Public |
| POST | `/api/catalog/brands` | `catalog.controller.brand.create` | `catalog.service.brand.create` | `authenticate`, `authorize(ADMIN)`, `validate(brand)` | Admin |
| PUT | `/api/catalog/brands/:id` | `catalog.controller.brand.update` | `catalog.service.brand.update` | `authenticate`, `authorize(ADMIN)`, `validate(brand)` | Admin |
| DELETE | `/api/catalog/brands/:id` | `catalog.controller.brand.remove` | `catalog.service.brand.remove` | `authenticate`, `authorize(ADMIN)` | Admin |
| GET | `/api/catalog/categories?q=&page=&limit=` | `catalog.controller.category.list` | `catalog.service.category.list` | `validate(search, query)` | Public |
| GET | `/api/catalog/categories/:id` | `catalog.controller.category.get` | `catalog.service.category.get` | None | Public |
| POST | `/api/catalog/categories` | `catalog.controller.category.create` | `catalog.service.category.create` | `authenticate`, `authorize(ADMIN)`, `validate(category)` | Admin |
| PUT | `/api/catalog/categories/:id` | `catalog.controller.category.update` | `catalog.service.category.update` | `authenticate`, `authorize(ADMIN)`, `validate(category)` | Admin |
| DELETE | `/api/catalog/categories/:id` | `catalog.controller.category.remove` | `catalog.service.category.remove` | `authenticate`, `authorize(ADMIN)` | Admin |
| GET | `/api/catalog/subcategories?q=&page=&limit=` | `catalog.controller.subcategory.list` | `catalog.service.subcategory.list` | `validate(search, query)` | Public |
| GET | `/api/catalog/subcategories/:id` | `catalog.controller.subcategory.get` | `catalog.service.subcategory.get` | None | Public |
| POST | `/api/catalog/subcategories` | `catalog.controller.subcategory.create` | `catalog.service.subcategory.create` | `authenticate`, `authorize(ADMIN)`, `validate(subcategory)` | Admin |
| PUT | `/api/catalog/subcategories/:id` | `catalog.controller.subcategory.update` | `catalog.service.subcategory.update` | `authenticate`, `authorize(ADMIN)`, `validate(subcategory)` | Admin |
| DELETE | `/api/catalog/subcategories/:id` | `catalog.controller.subcategory.remove` | `catalog.service.subcategory.remove` | `authenticate`, `authorize(ADMIN)` | Admin |

Request bodies:

```json
{
  "brand": { "name": "Nike", "description": "Sportswear brand", "logoUrl": "https://example.com/nike.png", "logoPublicId": "brands/nike", "isActive": true },
  "category": { "name": "Men", "description": "Men fashion", "isActive": true },
  "subcategory": { "categoryId": 1, "name": "Running Shoes", "description": "Performance shoes", "isActive": true }
}
```

Query parameters: `q` optional string; `page` integer min 1 default 1; `limit` integer 1-100 default 20.

### Products And Reviews

| Method | Route | Controller | Service | Middleware Chain | Access |
|---|---|---|---|---|---|
| GET | `/api/products` | `product.controller.list` | `product.service.list` | `validate(product.search, query)` | Public |
| GET | `/api/products/:id` | `product.controller.get` | `product.service.getById` | None | Public |
| POST | `/api/products` | `product.controller.create` | `product.service.create` | `authenticate`, `authorize(ADMIN)`, `validate(product.create)` | Admin |
| PUT | `/api/products/:id` | `product.controller.update` | `product.service.update` | `authenticate`, `authorize(ADMIN)`, `validate(product.update)` | Admin |
| DELETE | `/api/products/:id` | `product.controller.remove` | `product.service.remove` | `authenticate`, `authorize(ADMIN)` | Admin |
| GET | `/api/products/:productId/reviews` | `shop.controller.reviews.list` | `review.service.list` | None | Public |
| POST | `/api/products/:productId/reviews` | `shop.controller.reviews.upsert` | `review.service.upsert` | `authenticate`, `authorize(CUSTOMER)`, `validate(review)` | Customer |
| DELETE | `/api/products/:productId/reviews/me` | `shop.controller.reviews.remove` | `review.service.remove` | `authenticate`, `authorize(CUSTOMER)` | Customer |

Product search query parameters: `q`, `categoryId`, `subcategoryId`, `brandId`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`. Sort values: `newest`, `price_asc`, `price_desc`, `rating_desc`, `name_asc`.

Product create body:

```json
{
  "brandId": 1,
  "categoryId": 1,
  "subcategoryId": 1,
  "name": "Nike Air Zoom Pegasus",
  "description": "Lightweight running shoes for daily training.",
  "price": 8999,
  "compareAtPrice": 10999,
  "material": "Mesh",
  "fit": "Regular",
  "pattern": "Solid",
  "sizes": ["8", "9", "10"],
  "colors": ["Black", "White"],
  "isActive": true,
  "variants": [
    { "sku": "NIKE-PEG-BLK-8", "color": "Black", "size": "8", "stock": 25, "isActive": true }
  ],
  "images": [
    { "imageUrl": "https://example.com/pegasus-black.jpg", "publicId": "products/pegasus-black", "color": "Black", "isPrimary": true, "sortOrder": 0 }
  ]
}
```

Review body:

```json
{ "rating": 5, "title": "Excellent shoes", "comment": "Comfortable for daily running." }
```

### Addresses, Cart, Orders, Wishlist

| Method | Route | Controller | Service | Middleware Chain | Access |
|---|---|---|---|---|---|
| GET | `/api/shop/addresses` | `shop.controller.addresses.list` | `address.service.list` | `authenticate` | Auth |
| GET | `/api/shop/addresses/default` | `shop.controller.addresses.default` | `address.service.getDefault` | `authenticate` | Auth |
| GET | `/api/shop/addresses/:id` | `shop.controller.addresses.get` | `address.service.getOwned` | `authenticate` | Auth |
| POST | `/api/shop/addresses` | `shop.controller.addresses.create` | `address.service.create` | `authenticate`, `validate(address)` | Auth |
| PUT | `/api/shop/addresses/:id` | `shop.controller.addresses.update` | `address.service.update` | `authenticate`, `validate(address)` | Auth |
| DELETE | `/api/shop/addresses/:id` | `shop.controller.addresses.remove` | `address.service.remove` | `authenticate` | Auth |
| GET | `/api/shop/cart` | `shop.controller.cart.get` | `cart.service.getCart` | `authenticate`, `authorize(CUSTOMER)` | Customer |
| POST | `/api/shop/cart/items` | `shop.controller.cart.add` | `cart.service.addItem` | `authenticate`, `authorize(CUSTOMER)`, `validate(cartItem)` | Customer |
| PATCH | `/api/shop/cart/items` | `shop.controller.cart.update` | `cart.service.updateItem` | `authenticate`, `authorize(CUSTOMER)`, `validate(updateCartItem)` | Customer |
| DELETE | `/api/shop/cart/items/:variantId` | `shop.controller.cart.removeItem` | `cart.service.removeItem` | `authenticate`, `authorize(CUSTOMER)` | Customer |
| DELETE | `/api/shop/cart` | `shop.controller.cart.clear` | `cart.service.clear` | `authenticate`, `authorize(CUSTOMER)` | Customer |
| POST | `/api/shop/orders` | `shop.controller.orders.checkout` | `order.service.checkout` | `authenticate`, `authorize(CUSTOMER)`, `validate(checkout)` | Customer |
| GET | `/api/shop/orders/my` | `shop.controller.orders.mine` | `order.service.listMine` | `authenticate`, `authorize(CUSTOMER)` | Customer |
| GET | `/api/shop/orders/:id` | `shop.controller.orders.get` | `order.service.getOrder` | `authenticate` | Auth |
| POST | `/api/shop/orders/:orderId/items/:itemId/cancel` | `shop.controller.orders.cancelItem` | `order.service.cancelItem` | `authenticate`, `authorize(CUSTOMER)` | Customer |
| GET | `/api/shop/orders` | `shop.controller.orders.all` | `order.service.listAll` | `authenticate`, `authorize(ADMIN)` | Admin |
| PATCH | `/api/shop/orders/:id/status` | `shop.controller.orders.status` | `order.service.updateStatus` | `authenticate`, `authorize(ADMIN)`, `validate(orderStatus)` | Admin |
| PATCH | `/api/shop/orders/:orderId/items/:itemId/status` | `shop.controller.orders.itemStatus` | `order.service.updateItemStatus` | `authenticate`, `authorize(ADMIN)`, `validate(orderStatus)` | Admin |
| GET | `/api/shop/wishlist` | `shop.controller.wishlist.list` | `wishlist.service.list` | `authenticate`, `authorize(CUSTOMER)` | Customer |
| POST | `/api/shop/wishlist/:productId` | `shop.controller.wishlist.add` | `wishlist.service.add` | `authenticate`, `authorize(CUSTOMER)` | Customer |
| DELETE | `/api/shop/wishlist/:productId` | `shop.controller.wishlist.remove` | `wishlist.service.remove` | `authenticate`, `authorize(CUSTOMER)` | Customer |

Request bodies:

```json
{
  "address": {
    "name": "Pavan Kumar",
    "contactNumber": "9876543210",
    "pinCode": "560001",
    "state": "Karnataka",
    "area": "MG Road, Bengaluru",
    "landMark": "Near Metro Station",
    "buildingName": "A Block",
    "isDefault": true
  },
  "cartItem": { "productId": 1, "variantId": 1, "qty": 2 },
  "updateCartItem": { "variantId": 1, "qty": 1 },
  "checkout": { "paymentType": "COD", "addressId": 1, "couponCode": "WELCOME10" },
  "orderStatus": { "status": "SHIPPED" }
}
```

### Payments

| Method | Route | Controller | Service | Middleware Chain | Access |
|---|---|---|---|---|---|
| POST | `/api/shop/payments/razorpay/:orderId` | `payment.controller.createRazorpayOrder` | `payment.service.createOrder` | `authenticate`, `authorize(CUSTOMER)` | Customer |
| POST | `/api/shop/payments/verify` | `payment.controller.verify` | `payment.service.verifyPayment` | `authenticate`, `authorize(CUSTOMER)`, `validate(verifyPayment)` | Customer |
| POST | `/api/payments/webhook` | `payment.controller.webhook` | `payment.service.handleWebhook` | `express.raw({ type: 'application/json' })` | Razorpay webhook signature |

Verify payment body:

```json
{ "orderId": "order_razorpay_id", "paymentId": "pay_razorpay_id", "signature": "hmac-signature" }
```

Webhook required header: `x-razorpay-signature`.

### Users, Admin, Coupons, Uploads, Dashboard

| Method | Route | Controller | Service | Middleware Chain | Access |
|---|---|---|---|---|---|
| GET | `/api/users/me` | `user.controller.profile` | `user.service.profile` | `authenticate` | Auth |
| PATCH | `/api/users/me/username` | `user.controller.changeUsername` | `user.service.changeUsername` | `authenticate`, inline Joi | Auth |
| POST | `/api/users/me/change-password` | `user.controller.changePassword` | `user.service.changePassword` | `authenticate`, inline Joi | Auth |
| GET | `/api/admin/dashboard` | `admin.controller.dashboard` | `admin.service.dashboard` | `authenticate`, `authorize(ADMIN)` | Admin |
| GET | `/api/admin/users` | `user.controller.listUsers` | `user.service.listUsers` | `authenticate`, `authorize(ADMIN)` | Admin |
| DELETE | `/api/admin/users/:id` | `user.controller.deleteUser` | `user.service.softDeleteUser` | `authenticate`, `authorize(ADMIN)` | Admin |
| GET | `/api/admin/coupons` | `shop.controller.coupons.list` | `coupon.service.list` | `authenticate`, `authorize(ADMIN)` | Admin |
| GET | `/api/admin/coupons/:id` | `shop.controller.coupons.get` | `coupon.service.get` | `authenticate`, `authorize(ADMIN)` | Admin |
| POST | `/api/admin/coupons` | `shop.controller.coupons.create` | `coupon.service.create` | `authenticate`, `authorize(ADMIN)`, `validate(coupon)` | Admin |
| PUT | `/api/admin/coupons/:id` | `shop.controller.coupons.update` | `coupon.service.update` | `authenticate`, `authorize(ADMIN)`, `validate(coupon)` | Admin |
| DELETE | `/api/admin/coupons/:id` | `shop.controller.coupons.remove` | `coupon.service.remove` | `authenticate`, `authorize(ADMIN)` | Admin |
| POST | `/api/admin/uploads/product-images` | `upload.controller.productImage` | `upload.service.uploadImage` | `authenticate`, `authorize(ADMIN)`, `multer.single(image)` | Admin multipart |
| POST | `/api/admin/uploads/brand-logos` | `upload.controller.brandLogo` | `upload.service.uploadImage` | `authenticate`, `authorize(ADMIN)`, `multer.single(image)` | Admin multipart |
| PATCH | `/api/admin/me/username` | `user.controller.changeUsername` | `user.service.changeUsername` | `authenticate`, `authorize(ADMIN)`, inline Joi | Admin |

Coupon body:

```json
{
  "code": "WELCOME10",
  "description": "10 percent off",
  "discountType": "PERCENTAGE",
  "discountValue": 10,
  "maxDiscountAmount": 500,
  "minOrderAmount": 1000,
  "usageLimit": 100,
  "startsAt": "2026-06-01T00:00:00.000Z",
  "expiresAt": "2026-12-31T23:59:59.000Z",
  "isActive": true
}
```

## Error Responses

These examples reflect the global error format. Not every endpoint explicitly throws each status, but these are the possible statuses in middleware/services.

### 400

```json
{ "success": false, "error": "Validation failed", "details": ["\"name\" is required"], "path": "/api/catalog/brands", "timestamp": "2026-06-01T00:00:00.000Z" }
```

### 401

```json
{ "success": false, "error": "Authentication token is required", "details": null, "path": "/api/shop/cart", "timestamp": "2026-06-01T00:00:00.000Z" }
```

### 403

```json
{ "success": false, "error": "Access denied. Insufficient permissions", "details": null, "path": "/api/admin/dashboard", "timestamp": "2026-06-01T00:00:00.000Z" }
```

### 404

```json
{ "success": false, "error": "Product not found", "details": null, "path": "/api/products/999", "timestamp": "2026-06-01T00:00:00.000Z" }
```

### 409

```json
{ "success": false, "error": "User already exists", "details": null, "path": "/api/auth/register", "timestamp": "2026-06-01T00:00:00.000Z" }
```

### 422

The current code does not emit `422`; validation errors are returned as `400`.

```json
{ "success": false, "error": "Unprocessable Entity is not currently used by this API", "details": null, "path": "/api/example", "timestamp": "2026-06-01T00:00:00.000Z" }
```

### 500

```json
{ "success": false, "error": "Razorpay is not configured", "details": null, "path": "/api/shop/payments/razorpay/1", "timestamp": "2026-06-01T00:00:00.000Z" }
```

## Complete Test Data

Admin user:

```json
{ "username": "Admin", "email": "admin@example.com", "password": "Admin@12345", "role": "ADMIN" }
```

Customer user:

```json
{ "username": "Pavan Customer", "email": "customer@example.com", "password": "Customer@12345" }
```

Brands: Nike, Adidas, Puma.

Categories: Men, Women, Kids.

Subcategories: Running Shoes, Sneakers, Sportswear.

Products:

```json
[
  {
    "name": "Nike Air Zoom Pegasus",
    "brandId": 1,
    "categoryId": 1,
    "subcategoryId": 1,
    "description": "Daily running shoe with responsive cushioning.",
    "price": 8999,
    "compareAtPrice": 10999,
    "sizes": ["8", "9", "10"],
    "colors": ["Black", "White"],
    "variants": [
      { "sku": "NIKE-PEG-BLK-8", "color": "Black", "size": "8", "stock": 25, "isActive": true },
      { "sku": "NIKE-PEG-WHT-9", "color": "White", "size": "9", "stock": 15, "isActive": true }
    ],
    "images": [
      { "imageUrl": "https://example.com/nike-pegasus-black.jpg", "publicId": "products/nike-pegasus-black", "color": "Black", "isPrimary": true }
    ]
  }
]
```

Coupons:

```json
[
  { "code": "WELCOME10", "discountType": "PERCENTAGE", "discountValue": 10, "maxDiscountAmount": 500, "minOrderAmount": 1000, "usageLimit": 100, "isActive": true },
  { "code": "FLAT500", "discountType": "FIXED", "discountValue": 500, "minOrderAmount": 3000, "usageLimit": 50, "isActive": true }
]
```

India address:

```json
{ "name": "Pavan Kumar", "contactNumber": "9876543210", "pinCode": "560001", "state": "Karnataka", "area": "MG Road, Bengaluru", "landMark": "Near Metro Station", "buildingName": "A Block", "isDefault": true }
```

Order payloads:

```json
{
  "singleItemOrder": { "paymentType": "COD", "addressId": 1 },
  "couponOrder": { "paymentType": "RAZORPAY", "addressId": 1, "couponCode": "WELCOME10" }
}
```
