// File: backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../middleware/jwtMiddleware');

exports.register = async (req, res) => {
  const { name, email, password, role = 'student' } = req.body;

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'Email is already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role });
  const accessToken = signToken({ id: user.id, email: user.email, role: user.role });

  return res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const accessToken = signToken({ id: user.id, email: user.email, role: user.role });

  return res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    },
  });
};

exports.refreshToken = async (req, res) => {
  res.json({ message: 'Mock refresh successful', data: { accessToken: 'mock-token-2' } });
};

exports.logout = async (req, res) => {
  res.json({ message: 'Mock logout successful' });
};

exports.getMe = async (req, res) => {
  res.json({ message: 'Mock getMe', data: { id: '123', email: 'mock@local', role: 'student' } });
};

exports.changePassword = async (req, res) => {
  res.json({ message: 'Mock changePassword' });
};
