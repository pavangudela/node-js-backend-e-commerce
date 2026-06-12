import bcrypt from 'bcrypt';
import sequelize from '../database/sequelize.js';
 const seeder = {
  async up(queryInterface) {
    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@12345', 12);
    await queryInterface.bulkInsert('users', [{
      username: process.env.ADMIN_USERNAME || 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password,
      role: 'ADMIN',
      is_email_verified: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }], { ignoreDuplicates: true });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: process.env.ADMIN_EMAIL || 'admin@example.com' });
  }
};
 await seeder.up(sequelize.getQueryInterface());
 await sequelize.close();
