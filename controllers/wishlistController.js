const { WishlistItem, MenuItem } = require('../models');
const { addFlash } = require('../utils/flash');

exports.list = async (req, res) => {
  const items = await WishlistItem.findAll({
    where: { userId: req.user.id },
    include: [{ model: MenuItem, as: 'menuItem' }],
    order: [['createdAt', 'DESC']],
  });
  res.render('wishlist/index', { pageTitle: 'My wishlist', items });
};

exports.add = async (req, res) => {
  const { menuItemId } = req.params;
  try {
    await WishlistItem.findOrCreate({
      where: { userId: req.user.id, menuItemId },
    });
    addFlash(req, 'success', 'Added to wishlist.');
  } catch (error) {
    console.error('Wishlist add error', error);
    addFlash(req, 'error', 'Unable to add to wishlist.');
  }
  res.redirect(req.get('referer') || '/');
};

exports.remove = async (req, res) => {
  const { menuItemId } = req.params;
  try {
    await WishlistItem.destroy({ where: { userId: req.user.id, menuItemId } });
    addFlash(req, 'success', 'Removed from wishlist.');
  } catch (error) {
    console.error('Wishlist remove error', error);
    addFlash(req, 'error', 'Unable to remove item.');
  }
  res.redirect(req.get('referer') || '/wishlist');
};
