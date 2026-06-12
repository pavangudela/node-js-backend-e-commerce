# Code Quality Review

Review stance: defects, startup risks, behavioral risks, missing validation, and maintainability issues.

## Findings

| Severity | File | Issue | Recommendation |
|---|---|---|---|
| P0 | `package.json` and all `src/**/*.js` | Source uses ES modules, but `package.json` has no `"type": "module"`. Node will treat `.js` as CommonJS by default and fail on `import`. | Add `"type": "module"` or convert to CommonJS. |
| P0 | `.sequelizerc`, `src/config/sequelize-cli.js`, migrations, seeders | Sequelize CLI traditionally loads CommonJS config/migrations. Current config and migrations are ESM. | Use CommonJS `.cjs` config/migrations or configure CLI/runtime to support ESM. |
| P1 | `src/server.js` | `sequelize.sync()` runs before `authenticate()`, bypassing migration-only discipline. | Remove `sync()`; use `npm run db:migrate`. |
| P1 | `src/services/product.service.js` | `create` and `update` call `getById` inside a transaction without passing the transaction, so reads may occur outside the transaction before commit. | Pass transaction to follow-up reads or return after transaction commits. |
| P1 | `src/services/order.service.js` | Checkout decrements stock before successful Razorpay payment for `RAZORPAY` orders. Failed payment can strand stock unless cancellation/release flow exists. | Reserve stock for pending payments and decrement on capture, or add payment timeout release job. |
| P1 | `src/routes/shop.routes.js` | `GET /orders/:id` appears before admin `GET /orders`, but Express still distinguishes exact segment count. No runtime conflict, but order is easy to misread. | Place static `/orders` before parameterized `/orders/:id` for clarity. |
| P2 | `src/services/cart.service.js` | `updateItem` does not check missing variant after `findByPk`; `variant.stock` could throw. | Add explicit not-found and active checks. |
| P2 | `src/services/wishlist.service.js` | Adding wishlist item does not verify product exists or is active. | Validate product before `findOrCreate`. |
| P2 | `src/services/review.service.js` | Reviews do not require purchase verification. | Decide whether reviews are open or verified-buyer only; enforce if required. |
| P2 | `src/services/catalog.service.js` | Slug collisions are not handled gracefully; duplicate names throw DB errors. | Catch unique errors and return `409` with domain message. |
| P2 | `src/middlewares/upload.middleware.js` | File filter emits generic Error, not `AppError`; status becomes 500. | Convert to `AppError('Only image uploads are allowed', 400)`. |
| P2 | `src/middlewares/validate.middleware.js` | Only body/query validation is used; path params remain unvalidated. | Add `params` schemas. |
| P3 | `src/models/User.js` | Formatting artifact in `isEmailVerified` field. | Clean formatting. |
| P3 | `src/routes/admin.routes.js` | Admin username route duplicates user username functionality under `/admin/me/username`. | Keep if intentional; otherwise remove duplication. |

## Duplicated Code

- Catalog CRUD controller and service patterns are generic and reused well.
- Username change endpoint exists in both `/api/users/me/username` and `/api/admin/me/username`.
- Coupon CRUD is exposed only in admin routes but controller lives in `shop.controller.js`; consider a dedicated `coupon.controller.js`.

## Dead Or Risky Code

- `reservedStock` exists in `ProductVariant` but no service currently uses it.
- `isEmailVerified` exists but no route enforces it.
- `isApproved` exists on reviews, but there are no admin review moderation routes.

## Missing Validation

- Path params: `id`, `productId`, `variantId`, `orderId`, `itemId`.
- Multipart upload file size/type error normalization.
- Date relationship validation for coupons: `expiresAt` should be after `startsAt`.
- Product update variant ownership and deletion semantics.

## Refactoring Suggestions

1. Stabilize module format and Sequelize CLI compatibility first.
2. Separate `shop.controller.js` into `address.controller.js`, `cart.controller.js`, `order.controller.js`, `wishlist.controller.js`, `review.controller.js`, `coupon.controller.js`.
3. Add param validation middleware and schemas.
4. Create response mapper functions for product/cart/order payloads to avoid leaking all Sequelize fields.
5. Add integration tests for auth, catalog, product, cart, checkout, payment, and admin authorization.
