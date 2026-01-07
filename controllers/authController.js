const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User, PasswordResetToken } = require('../models');
const { addFlash } = require('../utils/flash');

exports.showRegister = (req, res) => {
  res.render('auth/register', { pageTitle: 'Create account' });
};

exports.register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    addFlash(req, 'error', 'All fields are required.');
    return res.redirect('/register');
  }
  if (password !== confirmPassword) {
    addFlash(req, 'error', 'Passwords do not match.');
    return res.redirect('/register');
  }
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      addFlash(req, 'error', 'Account already exists for that email.');
      return res.redirect('/register');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: 'customer' });
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    addFlash(req, 'success', 'Welcome! Your account is ready.');
    return res.redirect('/');
  } catch (error) {
    console.error('Register error', error);
    addFlash(req, 'error', 'Unable to create account. Please try again.');
    return res.redirect('/register');
  }
};

exports.showLogin = (req, res) => {
  res.render('auth/login', { pageTitle: 'Login' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    addFlash(req, 'error', 'Email and password required.');
    return res.redirect('/login');
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      addFlash(req, 'error', 'Invalid email or password.');
      return res.redirect('/login');
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      addFlash(req, 'error', 'Invalid email or password.');
      return res.redirect('/login');
    }
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    delete req.session.redirectTo; // Clear any stored redirect
    addFlash(req, 'success', 'Logged in successfully.');
    return res.redirect('/');
  } catch (error) {
    console.error('Login error', error);
    addFlash(req, 'error', 'Login failed. Please try again.');
    return res.redirect('/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.showForgotPassword = (req, res) => {
  res.render('auth/forgot', { pageTitle: 'Forgot password' });
};

exports.handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    addFlash(req, 'error', 'Please provide your email.');
    return res.redirect('/forgot-password');
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      addFlash(req, 'info', 'If that account exists, we have created a reset link.');
      return res.redirect('/forgot-password');
    }
    const tokenValue = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
    await PasswordResetToken.create({ userId: user.id, token: tokenValue, expiresAt });
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${tokenValue}`;
    console.log('Password reset link:', resetLink);
    return res.render('auth/reset-link', { pageTitle: 'Reset link generated', resetLink });
  } catch (error) {
    console.error('Forgot password error', error);
    addFlash(req, 'error', 'Unable to generate reset link.');
    return res.redirect('/forgot-password');
  }
};

exports.showResetPassword = async (req, res) => {
  const { token } = req.params;
  const resetToken = await PasswordResetToken.findOne({ where: { token, used: false } });
  if (!resetToken || resetToken.expiresAt < new Date()) {
    addFlash(req, 'error', 'Reset link is invalid or expired.');
    return res.redirect('/forgot-password');
  }
  return res.render('auth/reset', { pageTitle: 'Reset password', token });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    addFlash(req, 'error', 'Passwords do not match.');
    return res.redirect(`/reset-password/${token}`);
  }
  try {
    const resetToken = await PasswordResetToken.findOne({ where: { token, used: false } });
    if (!resetToken || resetToken.expiresAt < new Date()) {
      addFlash(req, 'error', 'Reset link is invalid or expired.');
      return res.redirect('/forgot-password');
    }
    const user = await User.findByPk(resetToken.userId);
    if (!user) {
      addFlash(req, 'error', 'User not found for this token.');
      return res.redirect('/forgot-password');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await user.update({ passwordHash });
    await resetToken.update({ used: true });
    addFlash(req, 'success', 'Password updated. Please log in.');
    return res.redirect('/login');
  } catch (error) {
    console.error('Reset password error', error);
    addFlash(req, 'error', 'Unable to reset password.');
    return res.redirect(`/reset-password/${token}`);
  }
};
