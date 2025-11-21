const { addFlash } = require('../utils/flash');
const { verifyToken } = require('../utils/jwt');

const getTokenFromHeader = (req) => {
  const header = req.headers?.authorization || '';
  if (header.startsWith('Bearer ')) {
    return header.slice(7);
  }
  return null;
};

const attachUser = (req, res, next) => {
  req.user = req.session.user || null;
  if (!req.user) {
    const token = getTokenFromHeader(req);
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        req.user = payload;
      }
    }
  }
  next();
};

const requireAuth = (req, res, next) => {
  if (req.session.user || req.user) {
    if (!req.session.user && req.user) {
      req.session.user = req.user;
    }
    return next();
  }
  addFlash(req, 'error', 'Please log in to continue.');
  req.session.redirectTo = req.originalUrl;
  return res.redirect('/login');
};

const requireAdmin = (req, res, next) => {
  if ((req.session.user && req.session.user.role === 'admin') || (req.user && req.user.role === 'admin')) {
    if (!req.session.user && req.user) {
      req.session.user = req.user;
    }
    return next();
  }
  addFlash(req, 'error', 'Admin access required.');
  req.session.redirectTo = req.originalUrl;
  return res.redirect('/login');
};

const requireApiAuth = (req, res, next) => {
  const token = getTokenFromHeader(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = payload;
  return next();
};

module.exports = { attachUser, requireAuth, requireAdmin, requireApiAuth };
