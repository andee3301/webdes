const { Op, fn, col } = require('sequelize');
const { MenuItem, Order, OrderItem, User, Review } = require('../models');
const { addFlash } = require('../utils/flash');

exports.dashboard = async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const ordersToday = await Order.count({ where: { createdAt: { [Op.gte]: startOfDay } } });
  const revenueToday =
    (await Order.sum('totalPrice', {
      where: { createdAt: { [Op.gte]: startOfDay }, status: { [Op.not]: 'cancelled' } },
    })) || 0;
  const userCount = await User.count();
  const statusCountsRaw = await Order.findAll({
    attributes: ['status', [fn('COUNT', col('status')), 'count']],
    group: ['status'],
    raw: true,
  });
  const statusCounts = statusCountsRaw.reduce((acc, row) => {
    acc[row.status] = Number(row.count);
    return acc;
  }, {});

  res.render('admin/dashboard', {
    pageTitle: 'Admin dashboard',
    ordersToday,
    revenueToday,
    userCount,
    statusCounts,
  });
};

// Menu items
exports.listMenuItems = async (req, res) => {
  const items = await MenuItem.findAll({
    order: [
      ['category', 'ASC'],
      ['name', 'ASC'],
    ],
  });
  res.render('admin/menu-list', { pageTitle: 'Manage menu items', items });
};

exports.newMenuItemForm = (req, res) => {
  res.render('admin/menu-form', { pageTitle: 'Add menu item', item: null });
};

exports.createMenuItem = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    imageUrl,
    originCountry,
    originFlag,
    region,
    process,
    variety,
    elevation,
    tastingNotes,
    roastLevel,
    flavorTags,
    isAvailable,
  } = req.body;
  try {
    await MenuItem.create({
      name,
      description,
      price,
      category,
      imageUrl,
      originCountry,
      originFlag,
      region,
      process,
      variety,
      elevation,
      tastingNotes,
      roastLevel,
      flavorTags,
      isAvailable: typeof isAvailable !== 'undefined',
    });
    addFlash(req, 'success', 'Menu item created.');
    res.redirect('/admin/menu-items');
  } catch (error) {
    console.error('Create menu item error', error);
    addFlash(req, 'error', 'Unable to create menu item.');
    res.redirect('/admin/menu-items/new');
  }
};

exports.editMenuItemForm = async (req, res) => {
  const item = await MenuItem.findByPk(req.params.id);
  if (!item) {
    addFlash(req, 'error', 'Menu item not found.');
    return res.redirect('/admin/menu-items');
  }
  res.render('admin/menu-form', { pageTitle: `Edit ${item.name}`, item });
};

exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    category,
    imageUrl,
    originCountry,
    originFlag,
    region,
    process,
    variety,
    elevation,
    tastingNotes,
    roastLevel,
    flavorTags,
    isAvailable,
  } = req.body;
  try {
    const item = await MenuItem.findByPk(id);
    if (!item) {
      addFlash(req, 'error', 'Menu item not found.');
      return res.redirect('/admin/menu-items');
    }
    await item.update({
      name,
      description,
      price,
      category,
      imageUrl,
      originCountry,
      originFlag,
      region,
      process,
      variety,
      elevation,
      tastingNotes,
      roastLevel,
      flavorTags,
      isAvailable: typeof isAvailable !== 'undefined',
    });
    addFlash(req, 'success', 'Menu item updated.');
     res.redirect('/admin/menu-items');
  } catch (error) {
    console.error('Update menu item error', error);
    addFlash(req, 'error', 'Unable to update menu item.');
    res.redirect(`/admin/menu-items/${id}/edit`);
  }
};

exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    await MenuItem.destroy({ where: { id } });
    addFlash(req, 'success', 'Menu item removed.');
  } catch (error) {
    console.error('Delete menu item error', error);
    addFlash(req, 'error', 'Unable to delete menu item.');
  }
  res.redirect('/admin/menu-items');
};

// Orders
exports.listOrders = async (req, res) => {
  const { status } = req.query;
  const where = {};
  if (status && status !== 'all') {
    where.status = status;
  }
  const orders = await Order.findAll({
    where,
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: OrderItem, as: 'items', include: [{ model: MenuItem, as: 'menuItem' }] },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.render('admin/orders', {
    pageTitle: 'Orders',
    orders,
    filterStatus: status || 'all',
  });
};

exports.viewOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByPk(id, {
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: OrderItem, as: 'items', include: [{ model: MenuItem, as: 'menuItem' }] },
    ],
  });
  if (!order) {
    addFlash(req, 'error', 'Order not found.');
    return res.redirect('/admin/orders');
  }
  res.render('admin/order-detail', { pageTitle: `Order #${order.id}`, order });
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      addFlash(req, 'error', 'Order not found.');
      return res.redirect('/admin/orders');
    }
    await order.update({ status });
    addFlash(req, 'success', 'Order status updated.');
  } catch (error) {
    console.error('Update order status error', error);
    addFlash(req, 'error', 'Unable to update status.');
  }
  res.redirect(`/admin/orders/${id}`);
};

// Reviews moderation
exports.listReviews = async (req, res) => {
  const { status } = req.query;
  const where = {};
  if (status && status !== 'all') where.status = status;
  const reviews = await Review.findAll({
    where,
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: MenuItem, as: 'menuItem', attributes: ['id', 'name'] },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.render('admin/reviews', { pageTitle: 'Reviews', reviews, filterStatus: status || 'all' });
};

exports.approveReview = async (req, res) => {
  const { id } = req.params;
  try {
    await Review.update({ status: 'approved' }, { where: { id } });
    addFlash(req, 'success', 'Review approved.');
  } catch (error) {
    console.error('Approve review error', error);
    addFlash(req, 'error', 'Unable to approve review.');
  }
  res.redirect('/admin/reviews');
};

exports.rejectReview = async (req, res) => {
  const { id } = req.params;
  try {
    await Review.update({ status: 'rejected' }, { where: { id } });
    addFlash(req, 'success', 'Review rejected.');
  } catch (error) {
    console.error('Reject review error', error);
    addFlash(req, 'error', 'Unable to reject review.');
  }
  res.redirect('/admin/reviews');
};
