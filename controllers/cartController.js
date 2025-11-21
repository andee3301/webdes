const { MenuItem } = require('../models');
const { addFlash } = require('../utils/flash');

const ensureCart = (req) => {
  if (!req.session.cart) req.session.cart = [];
  return req.session.cart;
};

const updateCart = (req, cart) => {
  req.session.cart = cart;
};

const findCartItemIndex = (cart, menuItemId) =>
  cart.findIndex((item) => Number(item.menuItemId) === Number(menuItemId));

exports.viewCart = (req, res) => {
  const cart = ensureCart(req);
  const total = cart.reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0);
  res.render('cart/index', { pageTitle: 'Your cart', cart, total });
};

exports.addToCart = async (req, res) => {
  const { menuItemId } = req.params;
  const quantity = Math.max(1, Number(req.body.quantity) || 1);
  try {
    const item = await MenuItem.findByPk(menuItemId);
    if (!item || !item.isAvailable) {
      addFlash(req, 'error', 'That item is not available.');
      return res.redirect(req.get('referer') || '/menu');
    }
    const cart = ensureCart(req);
    const existingIndex = findCartItemIndex(cart, menuItemId);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        menuItemId: item.id,
        name: item.name,
        price: parseFloat(item.price),
        imageUrl: item.imageUrl,
        quantity,
      });
    }
    updateCart(req, cart);
    addFlash(req, 'success', `${item.name} added to your cart.`);
    return res.redirect(req.get('referer') || '/cart');
  } catch (error) {
    console.error('Add to cart error', error);
    addFlash(req, 'error', 'Unable to add to cart.');
    return res.redirect(req.get('referer') || '/');
  }
};

exports.updateQuantity = (req, res) => {
  const { menuItemId } = req.params;
  const quantity = Math.max(1, Number(req.body.quantity) || 1);
  const cart = ensureCart(req);
  const index = findCartItemIndex(cart, menuItemId);
  if (index >= 0) {
    cart[index].quantity = quantity;
    updateCart(req, cart);
    addFlash(req, 'success', 'Cart updated.');
  }
  res.redirect('/cart');
};

exports.removeItem = (req, res) => {
  const { menuItemId } = req.params;
  const cart = ensureCart(req);
  const filtered = cart.filter((item) => Number(item.menuItemId) !== Number(menuItemId));
  updateCart(req, filtered);
  addFlash(req, 'success', 'Item removed.');
  res.redirect('/cart');
};
