import jwt from 'jsonwebtoken';

const auth = (roles = []) => (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const user = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');

    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Please sign in again' });
  }
};

export default auth;