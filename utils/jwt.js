const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'coffee-jwt-secret';
const TOKEN_EXPIRES_IN = '2h';

const generateToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
