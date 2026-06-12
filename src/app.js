import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import env from './config/env.js';
import routes from './routes/index.js';
import paymentController from './controllers/payment.controller.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.set('trust proxy', 1);
app.get('/', (req, res) => {
  res.json({ success: true, message: 'E-commerce API' });
});
app.use(helmet());
// app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin, credentials: true }));
app.use(cors({
  origin: [
    'https://web.postman.co',
    'https://*.postman.co',
    'http://127.0.0.1:5173'
  ],
  credentials: true
}));
app.use(compression());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.post(
  `${env.apiPrefix}/payments/webhook`,
  express.raw({ type: 'application/json' }),
  paymentController.webhook
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(env.apiPrefix, routes);
app.use(notFound);
app.use(errorHandler);

export default app;
