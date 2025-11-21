const path = require('path');
const dotenv = require('dotenv');
const { sequelize, MenuItem } = require('../models');
const { featuredCoffees } = require('./featuredCoffees');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const resetMenuStock = async () => {
  const transaction = await sequelize.transaction();
  try {
    await MenuItem.destroy({ where: {}, truncate: true, transaction });
    await MenuItem.bulkCreate(featuredCoffees, { transaction });
    await transaction.commit();
    console.log(`✅ Replaced menu with ${featuredCoffees.length} featured coffees.`);
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Failed to refresh menu stock:', error.message);
  } finally {
    await sequelize.close();
  }
};

resetMenuStock();
