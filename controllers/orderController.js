const { Order, OrderItem, MenuItem, sequelize } = require('../models');
const { addFlash } = require('../utils/flash');

const getCart = (req) => req.session.cart || [];

exports.checkoutPage = (req, res) => {
  const cart = getCart(req);
  if (!cart.length) {
    addFlash(req, 'error', 'Your cart is empty.');
    return res.redirect('/cart');
  }
  const total = cart.reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0);
  res.render('orders/checkout', { pageTitle: 'Checkout', cart, total });
};

exports.placeOrder = async (req, res) => {
  const cart = getCart(req);
  if (!cart.length) {
    addFlash(req, 'error', 'Your cart is empty.');
    return res.redirect('/cart');
  }
  const { shippingName, shippingAddress, shippingPhone, notes } = req.body;
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0);

  let transaction;
  try {
    transaction = await sequelize.transaction();
    const order = await Order.create(
      {
        userId: req.user.id,
        status: 'pending',
        totalPrice,
        shippingName,
        shippingAddress,
        shippingPhone,
        notes,
      },
      { transaction }
    );

    await Promise.all(
      cart.map((item) =>
        OrderItem.create(
          {
            orderId: order.id,
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: item.price,
            subtotal: item.quantity * item.price,
          },
          { transaction }
        )
      )
    );

    await transaction.commit();
    req.session.cart = [];
    addFlash(req, 'success', 'Order placed successfully!');
    return res.redirect(`/orders/${order.id}`);
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error('Checkout error', error);
    addFlash(req, 'error', 'Unable to place order.');
    return res.redirect('/checkout');
  }
};

exports.listOrders = async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id },
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: MenuItem, as: 'menuItem' }],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.render('orders/index', { pageTitle: 'My orders', orders });
};

exports.viewOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({
    where: { id, userId: req.user.id },
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: MenuItem, as: 'menuItem' }],
      },
    ],
  });
  if (!order) {
    addFlash(req, 'error', 'Order not found.');
    return res.redirect('/orders');
  }
  res.render('orders/detail', { pageTitle: `Order #${order.id}`, order });
};
