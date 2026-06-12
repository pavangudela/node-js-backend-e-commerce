const roles = ['ADMIN', 'CUSTOMER'];
const orderStatuses = ['PLACED', 'PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED'];
const paymentStatuses = ['PENDING', 'FAILED', 'SUCCESS', 'REFUNDED'];

const id = (Sequelize) => ({
  type: Sequelize.BIGINT.UNSIGNED,
  autoIncrement: true,
  primaryKey: true
});

const fk = (Sequelize, table, allowNull = false) => ({
  type: Sequelize.BIGINT.UNSIGNED,
  allowNull,
  references: { model: table, key: 'id' },
  onUpdate: 'CASCADE',
  onDelete: allowNull ? 'SET NULL' : 'RESTRICT'
});

const timestamps = (Sequelize, paranoid = true) => ({
  created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
  updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
  ...(paranoid ? { deleted_at: { type: Sequelize.DATE } } : {})
});

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: id(Sequelize),
      username: { type: Sequelize.STRING(120), allowNull: false },
      email: { type: Sequelize.STRING(180), allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.ENUM(...roles), allowNull: false, defaultValue: 'CUSTOMER' },
      is_email_verified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      last_login_at: { type: Sequelize.DATE },
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('brands', {
      id: id(Sequelize),
      name: { type: Sequelize.STRING(140), allowNull: false, unique: true },
      slug: { type: Sequelize.STRING(170), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT },
      logo_url: { type: Sequelize.STRING },
      logo_public_id: { type: Sequelize.STRING },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('categories', {
      id: id(Sequelize),
      name: { type: Sequelize.STRING(140), allowNull: false, unique: true },
      slug: { type: Sequelize.STRING(170), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('subcategories', {
      id: id(Sequelize),
      category_id: fk(Sequelize, 'categories'),
      name: { type: Sequelize.STRING(140), allowNull: false },
      slug: { type: Sequelize.STRING(170), allowNull: false },
      description: { type: Sequelize.TEXT },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      ...timestamps(Sequelize)
    });
    await queryInterface.addIndex('subcategories', ['category_id', 'slug'], { unique: true });

    await queryInterface.createTable('products', {
      id: id(Sequelize),
      brand_id: fk(Sequelize, 'brands', true),
      category_id: fk(Sequelize, 'categories'),
      subcategory_id: fk(Sequelize, 'subcategories', true),
      name: { type: Sequelize.STRING(180), allowNull: false },
      slug: { type: Sequelize.STRING(220), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT },
      price: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      compare_at_price: { type: Sequelize.DECIMAL(12, 2) },
      material: { type: Sequelize.STRING(120) },
      fit: { type: Sequelize.STRING(120) },
      pattern: { type: Sequelize.STRING(120) },
      sizes: { type: Sequelize.JSON },
      colors: { type: Sequelize.JSON },
      average_rating: { type: Sequelize.DECIMAL(3, 2), allowNull: false, defaultValue: 0 },
      total_reviews: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      ...timestamps(Sequelize)
    });
    await queryInterface.addIndex('products', ['brand_id']);
    await queryInterface.addIndex('products', ['category_id']);
    await queryInterface.addIndex('products', ['subcategory_id']);
    await queryInterface.addIndex('products', ['price']);

    await queryInterface.createTable('product_images', {
      id: id(Sequelize),
      product_id: fk(Sequelize, 'products'),
      image_url: { type: Sequelize.STRING, allowNull: false },
      public_id: { type: Sequelize.STRING },
      color: { type: Sequelize.STRING(80) },
      is_primary: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      sort_order: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('product_variants', {
      id: id(Sequelize),
      product_id: fk(Sequelize, 'products'),
      sku: { type: Sequelize.STRING(120), unique: true },
      color: { type: Sequelize.STRING(80), allowNull: false },
      size: { type: Sequelize.STRING(80), allowNull: false },
      stock: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      reserved_stock: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      ...timestamps(Sequelize)
    });
    await queryInterface.addIndex('product_variants', ['product_id', 'color', 'size'], { unique: true });

    await queryInterface.createTable('addresses', {
      id: id(Sequelize),
      user_id: fk(Sequelize, 'users'),
      name: { type: Sequelize.STRING(140), allowNull: false },
      contact_number: { type: Sequelize.STRING(30), allowNull: false },
      pin_code: { type: Sequelize.STRING(20), allowNull: false },
      state: { type: Sequelize.STRING(120), allowNull: false },
      area: { type: Sequelize.STRING(180), allowNull: false },
      land_mark: { type: Sequelize.STRING(180) },
      building_name: { type: Sequelize.STRING(180) },
      is_default: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('carts', {
      id: id(Sequelize),
      user_id: { ...fk(Sequelize, 'users'), unique: true },
      subtotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('cart_items', {
      id: id(Sequelize),
      cart_id: fk(Sequelize, 'carts'),
      variant_id: fk(Sequelize, 'product_variants'),
      size: { type: Sequelize.STRING(80), allowNull: false },
      color: { type: Sequelize.STRING(80), allowNull: false },
      unit_price: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      quantity: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
      ...timestamps(Sequelize)
    });
    await queryInterface.addIndex('cart_items', ['cart_id', 'variant_id'], { unique: true });

    await queryInterface.createTable('coupons', {
      id: id(Sequelize),
      code: { type: Sequelize.STRING(60), allowNull: false, unique: true },
      description: { type: Sequelize.STRING(255) },
      discount_type: { type: Sequelize.ENUM('PERCENTAGE', 'FIXED'), allowNull: false },
      discount_value: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      max_discount_amount: { type: Sequelize.DECIMAL(12, 2) },
      min_order_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      usage_limit: { type: Sequelize.INTEGER.UNSIGNED },
      used_count: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      starts_at: { type: Sequelize.DATE },
      expires_at: { type: Sequelize.DATE },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('orders', {
      id: id(Sequelize),
      user_id: fk(Sequelize, 'users'),
      address_id: fk(Sequelize, 'addresses'),
      coupon_id: fk(Sequelize, 'coupons', true),
      status: { type: Sequelize.ENUM(...orderStatuses), allowNull: false, defaultValue: 'PENDING' },
      payment_type: { type: Sequelize.ENUM('COD', 'RAZORPAY'), allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      discount_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      total_price: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      razorpay_order_id: { type: Sequelize.STRING },
      shipping_status: { type: Sequelize.STRING(80) },
      tracking_number: { type: Sequelize.STRING(160) },
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('order_items', {
      id: id(Sequelize),
      order_id: fk(Sequelize, 'orders'),
      variant_id: fk(Sequelize, 'product_variants'),
      product_id: fk(Sequelize, 'products'),
      product_name: { type: Sequelize.STRING(180), allowNull: false },
      color: { type: Sequelize.STRING(80), allowNull: false },
      size: { type: Sequelize.STRING(80), allowNull: false },
      price: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      quantity: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      line_total: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      status: { type: Sequelize.ENUM(...orderStatuses), allowNull: false, defaultValue: 'PENDING' },
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('payments', {
      id: id(Sequelize),
      order_id: fk(Sequelize, 'orders'),
      amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      currency: { type: Sequelize.STRING(10), allowNull: false, defaultValue: 'INR' },
      razorpay_order_id: { type: Sequelize.STRING, unique: true },
      razorpay_payment_id: { type: Sequelize.STRING, unique: true },
      razorpay_signature: { type: Sequelize.STRING },
      status: { type: Sequelize.ENUM(...paymentStatuses), allowNull: false, defaultValue: 'PENDING' },
      webhook_event_id: { type: Sequelize.STRING },
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('wishlist_items', {
      id: id(Sequelize),
      user_id: fk(Sequelize, 'users'),
      product_id: fk(Sequelize, 'products'),
      ...timestamps(Sequelize)
    });
    await queryInterface.addIndex('wishlist_items', ['user_id', 'product_id'], { unique: true });

    await queryInterface.createTable('reviews', {
      id: id(Sequelize),
      user_id: fk(Sequelize, 'users'),
      product_id: fk(Sequelize, 'products'),
      rating: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      title: { type: Sequelize.STRING(160) },
      comment: { type: Sequelize.TEXT },
      is_approved: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      ...timestamps(Sequelize)
    });
    await queryInterface.addIndex('reviews', ['user_id', 'product_id'], { unique: true });

    await queryInterface.createTable('coupon_redemptions', {
      id: id(Sequelize),
      coupon_id: fk(Sequelize, 'coupons'),
      user_id: fk(Sequelize, 'users'),
      order_id: fk(Sequelize, 'orders'),
      discount_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      ...timestamps(Sequelize)
    });
    await queryInterface.addIndex('coupon_redemptions', ['coupon_id', 'order_id'], { unique: true });

    await queryInterface.createTable('refresh_tokens', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      user_id: fk(Sequelize, 'users'),
      token_hash: { type: Sequelize.STRING(128), allowNull: false, unique: true },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      revoked_at: { type: Sequelize.DATE },
      replaced_by_token_id: { type: Sequelize.UUID },
      ip_address: { type: Sequelize.STRING(80) },
      user_agent: { type: Sequelize.STRING(255) },
      ...timestamps(Sequelize, false)
    });

    await queryInterface.createTable('user_tokens', {
      id: id(Sequelize),
      user_id: fk(Sequelize, 'users'),
      token_hash: { type: Sequelize.STRING(128), allowNull: false, unique: true },
      type: { type: Sequelize.ENUM('EMAIL_VERIFICATION', 'PASSWORD_RESET'), allowNull: false },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      consumed_at: { type: Sequelize.DATE },
      ...timestamps(Sequelize, false)
    });
  },

  async down(queryInterface) {
    const tables = [
      'user_tokens',
      'refresh_tokens',
      'coupon_redemptions',
      'reviews',
      'wishlist_items',
      'payments',
      'order_items',
      'orders',
      'coupons',
      'cart_items',
      'carts',
      'addresses',
      'product_variants',
      'product_images',
      'products',
      'subcategories',
      'categories',
      'brands',
      'users'
    ];

    for (const table of tables) {
      await queryInterface.dropTable(table);
    }
  }
};
