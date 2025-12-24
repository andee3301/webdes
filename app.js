const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require('./routes/authRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const shopRoutes = require('./routes/shopRoutes');
const pageRoutes = require('./routes/pageRoutes');
const apiAuthRoutes = require('./routes/apiAuthRoutes');
const apiMenuRoutes = require('./routes/apiMenuRoutes');
const { requireAdmin, attachUser } = require('./middleware/auth');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const sessionStore = new SequelizeStore({ db: sequelize });
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'coffee-session-secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    },
  })
);

app.use(attachUser);
app.use((req, res, next) => {
  res.locals.user = req.user;
  const cart = req.session.cart || [];
  res.locals.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  res.locals.flash = req.session.flash || [];
  delete req.session.flash;

  const orderStatusMeta = {
    pending: { label: 'Pending', badgeClass: 'bg-secondary' },
    confirmed: { label: 'Confirmed', badgeClass: 'bg-info text-dark' },
    shipped: { label: 'In shipping', badgeClass: 'bg-primary' },
    completed: { label: 'Completed', badgeClass: 'bg-success' },
    cancelled: { label: 'Cancelled', badgeClass: 'bg-danger' },
  };

  res.locals.orderStatusLabel = (status) => orderStatusMeta?.[status]?.label || status || 'Unknown';
  res.locals.orderStatusBadgeClass = (status) =>
    orderStatusMeta?.[status]?.badgeClass || 'bg-secondary';

  next();
});

app.use('/', authRoutes);
app.use('/api/auth', apiAuthRoutes);
app.use('/api/menu', apiMenuRoutes);
app.use('/menu', menuRoutes);
app.use('/shop', shopRoutes);
app.use('/', pageRoutes);
app.use('/', wishlistRoutes);
app.use('/', cartRoutes);
app.use('/', orderRoutes);
app.use('/admin', requireAdmin, adminRoutes);

// Serve landing SPA build from public/landing
const landingDir = path.join(__dirname, 'public', 'landing');
const landingIndex = path.join(landingDir, 'index.html');
if (fs.existsSync(landingIndex)) {
  app.get(['/', '/app', '/app/*'], (req, res) => res.sendFile(landingIndex));
} else {
  console.warn('Landing build not found. Run `npm run build:spa` to generate it (outputs to public/landing).');
}

app.use((req, res) => {
  res.status(404).render('404', { pageTitle: 'Not found' });
});

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');
    await sessionStore.sync();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`☕ Coffee shop app running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start application:', error?.message || error);
    if (error?.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
};

start();
