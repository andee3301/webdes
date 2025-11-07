const path = require('path');
const dotenv = require('dotenv');
const sequelize = require('../config/database');
const MenuItem = require('../models/MenuItem');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const items = [
  {
    name: 'Velvet Latte',
    category: 'coffee',
    price: 4.75,
    description: 'Double shot espresso, micro-foamed milk, vanilla bean drizzle.',
    imageUrl: 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Maple Cold Brew',
    category: 'coffee',
    price: 5.25,
    description: 'Slow-steeped cold brew sweetened with maple and citrus zest.',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Honey Citrus Chamomile',
    category: 'tea',
    price: 4.0,
    description: 'Chamomile, fresh lemon, and honey with a hint of ginger.',
    imageUrl: 'https://images.unsplash.com/photo-1481391047071-c068ba2aa346?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Cardamom Rose Scone',
    category: 'bakery',
    price: 3.5,
    description: 'Buttery scone infused with rosewater and cardamom glaze.',
    imageUrl: 'https://images.unsplash.com/photo-1589308078050-002c51eb7964?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Smoked Sea Salt Brownie',
    category: 'bakery',
    price: 3.75,
    description: 'Dark chocolate brownie with smoked sea salt flakes.',
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Winter Spice Flat White',
    category: 'seasonal',
    price: 5.5,
    description: 'Espresso and steamed milk with nutmeg, clove, and orange bitters.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  },
];

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    await MenuItem.bulkCreate(items);
    console.log(`✅ Seeded ${items.length} menu items.`);
  } catch (error) {
    console.error('❌ Failed to seed menu items:', error.message);
  } finally {
    await sequelize.close();
  }
};

seed();
