const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MenuItem = sequelize.define(
  'MenuItem',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
      type: DataTypes.STRING,
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
    roastLevel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    flavorTags: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'menu_items',
    timestamps: true,
  }
);

module.exports = MenuItem;
