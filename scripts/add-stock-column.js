/**
 * Migration script to add 'stock' column to menu_items table
 * Run this once to update your existing database schema
 */

const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

async function addStockColumn() {
  try {
    // Check if column already exists
    const [columns] = await sequelize.query(
      "PRAGMA table_info(menu_items);",
      { type: QueryTypes.SELECT }
    );
    
    const stockExists = columns.some(col => col.name === 'stock');
    
    if (stockExists) {
      console.log('✓ Stock column already exists in menu_items table');
      return;
    }

    // Add the stock column
    await sequelize.query(`
      ALTER TABLE menu_items 
      ADD COLUMN stock INTEGER DEFAULT NULL;
    `);

    console.log('✓ Successfully added stock column to menu_items table');
    console.log('  - Stock defaults to NULL (unlimited stock)');
    console.log('  - Admins can now set stock quantities for items');
  } catch (error) {
    console.error('Error adding stock column:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the migration
addStockColumn()
  .then(() => {
    console.log('\nMigration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nMigration failed:', error.message);
    process.exit(1);
  });
