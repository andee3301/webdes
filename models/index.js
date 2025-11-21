const sequelize = require('../config/database');
const User = require('./User');
const MenuItem = require('./MenuItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const WishlistItem = require('./WishlistItem');
const Review = require('./Review');
const PasswordResetToken = require('./PasswordResetToken');

// Associations
User.hasMany(Order, { foreignKey: 'userId', as: 'orders', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

MenuItem.hasMany(OrderItem, { foreignKey: 'menuItemId', as: 'orderItems' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'menuItemId', as: 'menuItem' });

User.belongsToMany(MenuItem, {
  through: WishlistItem,
  foreignKey: 'userId',
  otherKey: 'menuItemId',
  as: 'wishlist',
});
MenuItem.belongsToMany(User, {
  through: WishlistItem,
  foreignKey: 'menuItemId',
  otherKey: 'userId',
  as: 'wishlistedBy',
});
WishlistItem.belongsTo(User, { foreignKey: 'userId', as: 'user' });
WishlistItem.belongsTo(MenuItem, { foreignKey: 'menuItemId', as: 'menuItem' });

User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
MenuItem.hasMany(Review, { foreignKey: 'menuItemId', as: 'reviews' });
Review.belongsTo(MenuItem, { foreignKey: 'menuItemId', as: 'menuItem' });

User.hasMany(PasswordResetToken, { foreignKey: 'userId', as: 'passwordResetTokens' });
PasswordResetToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  MenuItem,
  Order,
  OrderItem,
  WishlistItem,
  Review,
  PasswordResetToken,
};
