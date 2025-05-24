// Mail configuration file
import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  host: process.env.MAIL_HOST || 'smtp.example.com',
  port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
  user: process.env.MAIL_USER || 'user@example.com',
  password: process.env.MAIL_PASSWORD || 'password',
  from: process.env.MAIL_FROM || 'ZBase <noreply@zbase.example.com>',
  secure: process.env.MAIL_SECURE === 'true' || false,
}));
