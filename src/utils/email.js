import nodemailer from 'nodemailer';
import env from '../config/env.js';
import logger from './logger.js';

const createTransport = () => {
  if (!env.smtp.host || !env.smtp.user) return null;
 return nodemailer.createTransport({
  host: env.smtp.host,
  port: Number(env.smtp.port),
  secure: false,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass
  },
  tls: {
    rejectUnauthorized: false
  }
});
};

export const sendEmail = async ({ to, subject, html }) => {
  const transport = createTransport();
  if (!transport) {
    logger.info({ to, subject }, 'SMTP not configured; email skipped');
    return;
  }

  await transport.sendMail({
    from: env.smtp.from,
    to,
    subject,
    html
  });
};

export default {
  sendEmail
};
