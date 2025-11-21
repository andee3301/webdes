const { Review, MenuItem } = require('../models');
const { addFlash } = require('../utils/flash');

exports.create = async (req, res) => {
  const { id } = req.params; // menu item id
  const { rating, comment } = req.body;
  if (!rating || !comment) {
    addFlash(req, 'error', 'Please provide rating and comment.');
    return res.redirect(`/menu/${id}`);
  }
  try {
    const item = await MenuItem.findByPk(id);
    if (!item) {
      addFlash(req, 'error', 'Menu item not found.');
      return res.redirect('/');
    }
    await Review.create({
      menuItemId: item.id,
      userId: req.user.id,
      rating: Number(rating),
      comment,
      status: 'pending',
    });
    addFlash(req, 'success', 'Review submitted for moderation.');
    return res.redirect(`/menu/${id}`);
  } catch (error) {
    console.error('Create review error', error);
    addFlash(req, 'error', 'Unable to submit review.');
    return res.redirect(`/menu/${id}`);
  }
};
