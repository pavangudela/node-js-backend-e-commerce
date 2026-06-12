import app from './app.js';
import env from './config/env.js';
import { sequelize } from './models/index.js';
import logger from './utils/logger.js';

const start = async () => {
  
  await sequelize.authenticate();
  const server = app.listen(env.port, () => {
    logger.info(`E-commerce API listening on port ${env.port}`);
  });

  const shutdown = async () => {
    logger.info('Shutting down server');
    server.close(async () => {
      await sequelize.close();
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

start().catch((error) => {
  logger.error(error);
  process.exit(1);
});
