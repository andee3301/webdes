const { Op, fn, col, literal } = require('sequelize');
const sequelize = require('../config/database');
const { MenuItem, Order, OrderItem, User, Review } = require('../models');
const { addFlash } = require('../utils/flash');

exports.dashboard = async (req, res) => {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  
  const startOfYesterday = new Date(startOfDay);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Today's stats
  const ordersToday = await Order.count({ where: { createdAt: { [Op.gte]: startOfDay } } });
  const revenueToday =
    (await Order.sum('totalPrice', {
      where: { createdAt: { [Op.gte]: startOfDay }, status: { [Op.not]: 'cancelled' } },
    })) || 0;
  
  // Yesterday's stats for comparison
  const ordersYesterday = await Order.count({ 
    where: { createdAt: { [Op.gte]: startOfYesterday, [Op.lt]: startOfDay } } 
  });
  const revenueYesterday =
    (await Order.sum('totalPrice', {
      where: { createdAt: { [Op.gte]: startOfYesterday, [Op.lt]: startOfDay }, status: { [Op.not]: 'cancelled' } },
    })) || 0;

  // This month stats
  const ordersThisMonth = await Order.count({ where: { createdAt: { [Op.gte]: startOfMonth } } });
  const revenueThisMonth =
    (await Order.sum('totalPrice', {
      where: { createdAt: { [Op.gte]: startOfMonth }, status: { [Op.not]: 'cancelled' } },
    })) || 0;

  // Last month stats for comparison
  const ordersLastMonth = await Order.count({ 
    where: { createdAt: { [Op.gte]: startOfLastMonth, [Op.lte]: endOfLastMonth } } 
  });
  const revenueLastMonth =
    (await Order.sum('totalPrice', {
      where: { createdAt: { [Op.gte]: startOfLastMonth, [Op.lte]: endOfLastMonth }, status: { [Op.not]: 'cancelled' } },
    })) || 0;

  // Average order value
  const avgOrderValue = ordersThisMonth > 0 ? revenueThisMonth / ordersThisMonth : 0;
  const avgOrderValueLastMonth = ordersLastMonth > 0 ? revenueLastMonth / ordersLastMonth : 0;

  const userCount = await User.count();
  const menuItemCount = await MenuItem.count();
  const lowStockCount = await MenuItem.count({ where: { stock: { [Op.lt]: 10, [Op.gt]: 0 } } });
  const outOfStockCount = await MenuItem.count({ where: { stock: 0 } });

  // Status counts
  const statusCountsRaw = await Order.findAll({
    attributes: ['status', [fn('COUNT', col('status')), 'count']],
    group: ['status'],
    raw: true,
  });
  const statusCounts = statusCountsRaw.reduce((acc, row) => {
    acc[row.status] = Number(row.count);
    return acc;
  }, {});

  // Revenue by day (last 7 days) for chart
  const revenueByDay = await Order.findAll({
    attributes: [
      [fn('DATE', col('createdAt')), 'date'],
      [fn('SUM', col('totalPrice')), 'revenue'],
      [fn('COUNT', col('id')), 'orders']
    ],
    where: { 
      createdAt: { [Op.gte]: startOfWeek },
      status: { [Op.not]: 'cancelled' }
    },
    group: [fn('DATE', col('createdAt'))],
    order: [[fn('DATE', col('createdAt')), 'ASC']],
    raw: true,
  });

  // Top selling products (this month)
  const topProducts = await OrderItem.findAll({
    attributes: [
      'menuItemId',
      [fn('SUM', col('quantity')), 'totalQty'],
      [fn('SUM', col('subtotal')), 'totalRevenue']
    ],
    include: [{
      model: MenuItem,
      as: 'menuItem',
      attributes: ['id', 'name', 'category', 'imageUrl', 'originCountry', 'originFlag']
    }],
    where: {
      createdAt: { [Op.gte]: startOfMonth }
    },
    group: ['menuItemId', 'menuItem.id'],
    order: [[fn('SUM', col('quantity')), 'DESC']],
    limit: 5,
    raw: false,
  });

  // Recent orders
  const recentOrders = await Order.findAll({
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: OrderItem, as: 'items', include: [{ model: MenuItem, as: 'menuItem', attributes: ['id', 'name'] }] },
    ],
    order: [['createdAt', 'DESC']],
    limit: 5,
  });

  res.render('admin/dashboard', {
    pageTitle: 'Admin Dashboard',
    // Today stats
    ordersToday,
    revenueToday,
    ordersYesterday,
    revenueYesterday,
    // Monthly stats
    ordersThisMonth,
    revenueThisMonth,
    ordersLastMonth,
    revenueLastMonth,
    avgOrderValue,
    avgOrderValueLastMonth,
    // Inventory
    userCount,
    menuItemCount,
    lowStockCount,
    outOfStockCount,
    // Charts data
    statusCounts,
    revenueByDay: JSON.stringify(revenueByDay),
    topProducts,
    recentOrders,
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
    stock,
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
      stock: stock && stock !== '' ? parseInt(stock, 10) : null,
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
    stock,
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
      stock: stock && stock !== '' ? parseInt(stock, 10) : null,
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

// Quick update for stock and image URL (inline editing)
exports.quickUpdateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { stock, imageUrl } = req.body;
  try {
    const item = await MenuItem.findByPk(id);
    if (!item) {
      addFlash(req, 'error', 'Menu item not found.');
      return res.redirect('/admin/menu-items');
    }
    const updates = {};
    if (stock !== undefined && stock !== '') {
      updates.stock = parseInt(stock, 10);
    } else if (stock === '') {
      updates.stock = null; // unlimited
    }
    if (imageUrl !== undefined) {
      updates.imageUrl = imageUrl;
    }
    await item.update(updates);
    addFlash(req, 'success', `${item.name} updated successfully.`);
  } catch (error) {
    console.error('Quick update menu item error', error);
    addFlash(req, 'error', 'Unable to update menu item.');
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
