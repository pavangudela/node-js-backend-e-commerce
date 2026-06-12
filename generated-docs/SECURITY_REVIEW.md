# Security Review

Source files inspected: auth middleware, token service, password utils, validation middleware, upload middleware, Razorpay payment service, app security middleware, environment config.

## Findings

| Severity | Area | Finding | Recommendation |
|---|---|---|---|
| High | Module system / startup | Code uses ESM `import/export`, but `package.json` does not declare `"type": "module"`. This can prevent startup and indirectly block all security middleware. | Add `"type": "module"` or convert all files to CommonJS consistently. |
| High | Database lifecycle | `server.js` calls `sequelize.sync()` in addition to migrations. This can alter production schema unexpectedly. | Remove `sync()` and run migrations explicitly in deployment. |
| High | Razorpay webhook | `RAZORPAY_WEBHOOK_SECRET` is optional in env config, but webhook verification uses it. Missing secret can break verification or cause runtime errors. | Require webhook secret in production and fail fast if missing. |
| Medium | Email verification | `isEmailVerified` is stored, but protected actions do not enforce verified email. | Add `requireVerifiedEmail` middleware for checkout, reviews, and sensitive account operations. |
| Medium | Refresh tokens | Refresh token rotation is present, but token reuse detection does not revoke the whole token family. | On mismatch or reuse, revoke all active refresh tokens for that user. |
| Medium | Password reset | Existing password reset tokens are not invalidated before issuing a new one. | Expire or consume previous active password reset tokens per user. |
| Medium | Uploads | Multer fileFilter returns a generic `Error`, and Cloudinary credentials are not checked before upload. | Convert upload errors to `AppError`; validate Cloudinary config at startup for upload-enabled environments. |
| Medium | Authorization | `/api/shop/orders/:id` uses generic auth and service-side owner check. Admin can access all; customer can access own. This is acceptable but implicit. | Document this behavior and add route-level role clarity if desired. |
| Medium | Validation | Path params are not Joi-validated; Express receives strings and services coerce some but not all. | Add param validation middleware for all `:id`, `:productId`, `:variantId`, `:orderId`, `:itemId`. |
| Low | CORS | `CORS_ORIGIN` defaults to `*`. | Require explicit allowlist in production. |
| Low | Rate limiting | Single global limiter applies to all routes. | Add stricter auth/password reset limiters and separate upload limits. |
| Low | Error disclosure | Non-production mode returns raw error messages. Production hides 500s only. | Avoid exposing integration exception details in all environments used by testers or staging users. |

## Positive Controls

- JWT access tokens are verified by middleware.
- Refresh tokens are persisted hashed, rotated, and revocable.
- Passwords are hashed with bcrypt.
- Role-based authorization exists for admin/customer routes.
- Joi validation strips unknown properties.
- Helmet, CORS, compression, and rate limiting are registered.
- Razorpay payment verification uses HMAC signature comparison.
- Webhook route uses `express.raw` before JSON parser, which is required for signature verification.
- File upload is memory-backed and limited to 5 MB.

## Recommended Security Hardening

1. Make module format and startup deterministic.
2. Remove `sequelize.sync()` from production startup.
3. Enforce required secrets in production: JWT access, JWT refresh, Razorpay key/secret/webhook, Cloudinary credentials when upload routes are enabled.
4. Add param validation for every dynamic path segment.
5. Enforce email verification for checkout and payment actions.
6. Add auth-specific rate limits.
7. Add audit logs for admin destructive actions.
8. Add purchase verification before product reviews if reviews should be buyer-only.
