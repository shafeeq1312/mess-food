import jwt from 'jsonwebtoken';

export const signToken = (user) => jwt.sign(
  { id: user._id, role: user.role, name: user.name, email: user.email },
  process.env.JWT_SECRET || 'dev-secret',
  { expiresIn: '7d' }
);

export const publicUser = (user) => ({ name: user.name, email: user.email, role: user.role });