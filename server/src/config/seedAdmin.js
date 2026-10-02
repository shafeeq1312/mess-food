import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const seedAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || 'admin123@gmail.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'password123456767';
  const exists = await User.findOne({ email });

  if (!exists) {
    await User.create({
      name: 'Mess Admin',
      email,
      password: await bcrypt.hash(password, 12),
      role: 'admin'
    });
  }
};

export default seedAdmin;