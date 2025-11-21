const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WishlistItem = sequelize.define(
  'WishlistItem',
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    menuItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'wishlist_items',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'menuItemId'],
      },
    ],
  }
);

module.exports = WishlistItem;
