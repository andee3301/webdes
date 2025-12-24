const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const slugify = (value) =>
  value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .substring(0, 140);

const MenuItem = sequelize.define(
  'MenuItem',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originCountry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    originFlag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    region: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    process: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    variety: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    elevation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tastingNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    flavorTags: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    roastLevel: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Medium',
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        min: 0,
      },
    },
  },
  {
    tableName: 'menu_items',
    timestamps: true,
  }
);

MenuItem.addHook('beforeValidate', (menuItem) => {
  if (!menuItem || !menuItem.name) return;
  if (!menuItem.slug || menuItem.changed('name')) {
    const generated = slugify(menuItem.name);
    menuItem.slug = generated || `menu-item-${Date.now()}`;
  }
});

module.exports = MenuItem;
