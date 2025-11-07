const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const menuRoutes = require('./routes/menuRoutes');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', menuRoutes);

app.use((req, res) => {
  res.status(404).render('404');
});

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`☕ Coffee shop app running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start application:', error.message);
    process.exit(1);
  }
};

start();
