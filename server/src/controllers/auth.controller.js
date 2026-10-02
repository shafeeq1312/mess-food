import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { publicUser, signToken } from '../utils/auth.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    const user = await User.create({ name, email: email.toLowerCase(), password: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    res.status(400).json({ message: error.code === 11000 ? 'Email is already registered' : error.message });
  }
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email?.toLowerCase() });
  if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ token: signToken(user), user: publicUser(user) });
};