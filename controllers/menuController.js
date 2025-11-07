const MenuItem = require('../models/MenuItem');

exports.getHome = async (req, res) => {
  const categories = ['coffee', 'tea', 'bakery', 'seasonal'];
  const menu = {};

  await Promise.all(
    categories.map(async (category) => {
      menu[category] = await MenuItem.findAll({
        where: { category, isAvailable: true },
        order: [['name', 'ASC']],
      });
    })
  );

  res.render('home', { menu });
};

exports.getAdminDashboard = async (req, res) => {
  const items = await MenuItem.findAll({ order: [['category', 'ASC'], ['name', 'ASC']] });
  res.render('admin/index', { items });
};

exports.getAddForm = (req, res) => {
  res.render('admin/add');
};

exports.createItem = async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;

  await MenuItem.create({
    name,
    description,
    price,
    category,
    imageUrl,
  });

  res.redirect('/admin');
};
