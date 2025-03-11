import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 12,
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET,
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    reset_pass_secret: process.env.JWT_RESET_PASS_SECRET,
    reset_pass_expires_in: process.env.JWT_RESET_PASS_EXPIRES_IN,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  emailSender: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
    contact_mail_address: process.env.CONTACT_MAIL_ADDRESS,
  },
  serverUrl: process.env.SERVER_URL,
};
