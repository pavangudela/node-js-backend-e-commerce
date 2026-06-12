# Performance Review

Source files inspected: services, models, migrations, indexes, routes.

## Findings

| Severity | Area | Finding | Recommendation |
|---|---|---|---|
| High | Startup/schema | `sequelize.sync()` runs on startup. This can slow startup and mutate schema in production. | Use migrations only; remove sync from `server.js`. |
| Medium | Checkout | Checkout locks each variant in a loop. Correct for safety, but may become slow for large carts. | Keep transactions short; cap cart size; batch load variants before lock/update where possible. |
| Medium | Product list | Product search eager-loads brand, category, subcategory, images, and variants for every result. | For listing pages, return primary image and summary variants only; use detail endpoint for full associations. |
| Medium | Product search | Keyword search uses `%LIKE%` on `name` and `description`, which cannot use standard indexes efficiently. | Add MySQL full-text index or external search service for production search. |
| Medium | Review rating | Rating recalculation loads all reviews for a product on each write. | Use aggregate SQL `AVG` and `COUNT`, or maintain counters transactionally. |
| Medium | Admin dashboard | Dashboard counts multiple tables and fetches low stock every request. | Cache dashboard metrics for short intervals or use materialized reporting tables. |
| Medium | Cart response | Cart includes product images for each variant, which can over-fetch. | Filter primary image by color, limit image attributes, or add a denormalized thumbnail field. |
| Low | Pagination | Some admin/list endpoints such as coupons, orders, users are not paginated. | Add `page` and `limit` query validation for admin list endpoints. |
| Low | Indexing | `orders.user_id`, `order_items.order_id`, `payments.order_id`, `reviews.product_id`, and `wishlist_items.user_id` rely mostly on FK indexes. | Confirm MySQL FK indexes exist; add explicit indexes where query plans need them. |

## N+1 Review

- Product listing avoids classic N+1 by eager loading associations in one Sequelize query, but the joined result can become heavy.
- Cart retrieval eager-loads item -> variant -> product -> images; safe for small carts, but can over-fetch.
- Checkout loops through cart items and performs one locked variant lookup per item; intentionally safe, but should be monitored.
- Review recalculation is an O(N) query per review mutation.

## Recommended Optimizations

1. Remove `sequelize.sync()` from startup.
2. Split product search response from product detail response.
3. Add full-text search for products.
4. Add pagination to users, orders, coupons, reviews.
5. Replace review recalculation with aggregate SQL.
6. Add explicit indexes for high-volume query paths after running `EXPLAIN`.
7. Use read replicas or caching for dashboard analytics as traffic grows.
