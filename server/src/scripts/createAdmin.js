import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import { connectDB } from '../config/db.js';

const createAdmin = async () => {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error('Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in server/.env before creating an admin.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('ADMIN_EMAIL must be a valid email address.');
  }
  if (password.length < 6) {
    throw new Error('ADMIN_PASSWORD must be at least 6 characters long.');
  }

  await connectDB();

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    throw new Error('An admin account already exists for ADMIN_EMAIL; no account was changed.');
  }

  await Admin.create({
    name,
    email,
    password,
    role: 'Super Admin'
  });
  console.info('Created the configured Super Admin account.');
};

try {
  await createAdmin();
} catch (error) {
  console.error(`[Create Admin] ${error.message}`);
  process.exitCode = 1;
} finally {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
