const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { sequelize, MenuItem, User, Order, OrderItem } = require('../models');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const slugify = (value) =>
  value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .substring(0, 140);

const beans = [
  {
    name: 'Ethiopia Yirgacheffe Chelbessa',
    category: 'coffee',
    price: 18.5,
    description: 'Florals, bergamot, honey sweetness; elegant tea-like body.',
    originCountry: 'Ethiopia',
    originFlag: '🇪🇹',
    region: 'Yirgacheffe, Gedeo',
    process: 'Washed',
    variety: 'Heirloom',
    elevation: '1,900–2,100m',
    tastingNotes: 'Bergamot|Jasmine|Honey',
    roastLevel: 'Light',
    imageUrl: '/images/stock/coffee-0001-6c5a3a91.jpg',
  },
  {
    name: 'Ethiopia Guji Shakiso',
    category: 'coffee',
    price: 19.0,
    description: 'Stone fruit and citrus with clean florals.',
    originCountry: 'Ethiopia',
    originFlag: '🇪🇹',
    region: 'Shakiso, Guji',
    process: 'Natural',
    variety: 'Heirloom',
    elevation: '1,850–2,000m',
    tastingNotes: 'Peach|Mandarin|Chamomile',
    roastLevel: 'Light',
    imageUrl: '/images/stock/coffee-0002-2ed4d65c.jpg',
  },
  {
    name: 'Kenya Kirinyaga AA',
    category: 'coffee',
    price: 20.0,
    description: 'Blackcurrant, grapefruit, and cane sugar finish.',
    originCountry: 'Kenya',
    originFlag: '🇰🇪',
    region: 'Kirinyaga',
    process: 'Washed',
    variety: 'SL28 / SL34',
    elevation: '1,700–1,900m',
    tastingNotes: 'Blackcurrant|Grapefruit|Cane sugar',
    roastLevel: 'Light-Medium',
    imageUrl: '/images/stock/coffee-0003-f5a2222c.jpg',
  },
  {
    name: 'Kenya Nyeri Peaberry',
    category: 'coffee',
    price: 19.5,
    description: 'Vibrant acidity with sweet berry and cocoa nib.',
    originCountry: 'Kenya',
    originFlag: '🇰🇪',
    region: 'Nyeri',
    process: 'Washed',
    variety: 'SL28 / SL34',
    elevation: '1,750–1,950m',
    tastingNotes: 'Blackberry|Cocoa nib|Red currant',
    roastLevel: 'Light-Medium',
    imageUrl: '/images/stock/coffee-0004-c24e907a.jpg',
  },
  {
    name: 'Colombia Huila Supremo',
    category: 'coffee',
    price: 17.0,
    description: 'Bright citrus acidity balanced by sweet caramel notes.',
    originCountry: 'Colombia',
    originFlag: '🇨🇴',
    region: 'Huila',
    process: 'Washed',
    variety: 'Caturra',
    elevation: '1,600–1,850m',
    tastingNotes: 'Caramel|Orange|Almond',
    roastLevel: 'Medium',
    imageUrl: '/images/stock/coffee-0005-09d3e1b1.jpg',
  },
  {
    name: 'Colombia Pink Bourbon Honey',
    category: 'coffee',
    price: 19.0,
    description: 'Strawberry candy sweetness, tropical finish.',
    originCountry: 'Colombia',
    originFlag: '🇨🇴',
    region: 'Huila',
    process: 'Honey',
    variety: 'Pink Bourbon',
    elevation: '1,700m',
    tastingNotes: 'Strawberry|Papaya|Honey',
    roastLevel: 'Light-Medium',
    imageUrl: '/images/stock/coffee-0006-be0e0db0.jpg',
  },
  {
    name: 'Colombia Diego Bermudez Thermal',
    category: 'coffee',
    price: 22.0,
    description: 'Experimental thermal shock with explosive aromatics.',
    originCountry: 'Colombia',
    originFlag: '🇨🇴',
    region: 'Cauca',
    process: 'Thermal Shock Washed',
    variety: 'Castillo',
    elevation: '1,700m',
    tastingNotes: 'Red fruit|Tropical|Florals',
    roastLevel: 'Light',
    imageUrl: '/images/stock/coffee-0007-b1a635bb.jpg',
  },
  {
    name: 'Guatemala Huehuetenango',
    category: 'coffee',
    price: 16.5,
    description: 'Chocolate, caramel, citrus zest with creamy body.',
    originCountry: 'Guatemala',
    originFlag: '🇬🇹',
    region: 'Huehuetenango',
    process: 'Washed',
    variety: 'Caturra / Bourbon',
    elevation: '1,600–1,900m',
    tastingNotes: 'Milk chocolate|Caramel|Orange zest',
    roastLevel: 'Medium',
    imageUrl: '/images/stock/coffee-0008-7b2fc1ae.jpg',
  },
  {
    name: 'Guatemala Acatenango Natural',
    category: 'coffee',
    price: 18.0,
    description: 'Dense sweetness with berry jam and cocoa finish.',
    originCountry: 'Guatemala',
    originFlag: '🇬🇹',
    region: 'Acatenango',
    process: 'Natural',
    variety: 'Catuai',
    elevation: '1,550–1,800m',
    tastingNotes: 'Berry jam|Cocoa|Praline',
    roastLevel: 'Medium',
    imageUrl: '/images/stock/coffee-0009-a3717674.jpg',
  },
  {
    name: 'Costa Rica Tarrazú Honey',
    category: 'coffee',
    price: 18.5,
    description: 'Balanced honey process with citrus and toffee.',
    originCountry: 'Costa Rica',
    originFlag: '🇨🇷',
    region: 'Tarrazú',
    process: 'Honey',
    variety: 'Caturra / Catuai',
    elevation: '1,700m',
    tastingNotes: 'Toffee|Mandarin|Red apple',
    roastLevel: 'Medium',
    imageUrl: '/images/stock/coffee-0010-52e74dd2.jpg',
  },
  {
    name: 'Panama Boquete Geisha',
    category: 'coffee',
    price: 28.0,
    description: 'Classic geisha florals with citrus and tea-like sweetness.',
    originCountry: 'Panama',
    originFlag: '🇵🇦',
    region: 'Boquete',
    process: 'Washed',
    variety: 'Geisha',
    elevation: '1,800m',
    tastingNotes: 'Jasmine|Citrus|Honeydew',
    roastLevel: 'Light',
    imageUrl: '/images/stock/coffee-0011-2956a5ff.jpg',
  },
  {
    name: 'Brazil Cerrado Natural',
    category: 'coffee',
    price: 14.0,
    description: 'Nutty sweetness with cocoa and mild acidity.',
    originCountry: 'Brazil',
    originFlag: '🇧🇷',
    region: 'Cerrado',
    process: 'Natural',
    variety: 'Bourbon',
    elevation: '1,100m',
    tastingNotes: 'Hazelnut|Cocoa|Brown sugar',
    roastLevel: 'Medium',
    imageUrl: '/images/stock/coffee-0012-d9c9ba2d.jpg',
  },
  {
    name: 'Brazil Sul de Minas Pulped',
    category: 'coffee',
    price: 14.5,
    description: 'Pulped natural with caramel and gentle fruit.',
    originCountry: 'Brazil',
    originFlag: '🇧🇷',
    region: 'Sul de Minas',
    process: 'Pulped Natural',
    variety: 'Mundo Novo',
    elevation: '1,150m',
    tastingNotes: 'Caramel|Red apple|Almond',
    roastLevel: 'Medium',
    imageUrl: '/images/stock/coffee-0013-274800d9.jpg',
  },
  {
    name: 'Peru Cajamarca Washed',
    category: 'coffee',
    price: 15.5,
    description: 'Sweet citrus, panela, and creamy body.',
    originCountry: 'Peru',
    originFlag: '🇵🇪',
    region: 'Cajamarca',
    process: 'Washed',
    variety: 'Caturra / Typica',
    elevation: '1,700–1,900m',
    tastingNotes: 'Panela|Lime|Cocoa',
    roastLevel: 'Light-Medium',
    imageUrl: '/images/stock/coffee-0014-4a30aa24.jpg',
  },
  {
    name: 'Peru Cusco Honey',
    category: 'coffee',
    price: 16.0,
    description: 'Honey processed with dried fruit and sugarcane sweetness.',
    originCountry: 'Peru',
    originFlag: '🇵🇪',
    region: 'Cusco',
    process: 'Honey',
    variety: 'Catuai',
    elevation: '1,750m',
    tastingNotes: 'Dried fruit|Sugarcane|Cocoa nib',
    roastLevel: 'Light-Medium',
    imageUrl: '/images/stock/coffee-0015-a4d1ac38.jpg',
  },
  {
    name: 'Rwanda Nyamasheke',
    category: 'coffee',
    price: 17.5,
    description: 'Sweet citrus, black tea, and florals.',
    originCountry: 'Rwanda',
    originFlag: '🇷🇼',
    region: 'Nyamasheke',
    process: 'Washed',
    variety: 'Red Bourbon',
    elevation: '1,700–1,900m',
    tastingNotes: 'Mandarin|Black tea|Brown sugar',
    roastLevel: 'Light-Medium',
    imageUrl: '/images/stock/coffee-0016-d09acf90.jpg',
  },
  {
    name: 'Burundi Kayanza Honey',
    category: 'coffee',
    price: 17.0,
    description: 'Red fruit sweetness with silky mouthfeel.',
    originCountry: 'Burundi',
    originFlag: '🇧🇮',
    region: 'Kayanza',
    process: 'Honey',
    variety: 'Bourbon',
    elevation: '1,700m',
    tastingNotes: 'Raspberry|Caramel|Black tea',
    roastLevel: 'Light-Medium',
    imageUrl: '/images/stock/coffee-0017-ef806bb9.jpg',
  },
  {
    name: 'Uganda Mt. Elgon',
    category: 'coffee',
    price: 15.0,
    description: 'Rich cocoa, plum, and molasses sweetness.',
    originCountry: 'Uganda',
    originFlag: '🇺🇬',
    region: 'Mt. Elgon',
    process: 'Washed',
    variety: 'SL14 / SL28',
    elevation: '1,800m',
    tastingNotes: 'Plum|Molasses|Cocoa',
    roastLevel: 'Medium',
    imageUrl: '/images/stock/coffee-0018-2faf6914.jpg',
  },
  {
    name: 'Tanzania Kilimanjaro',
    category: 'coffee',
    price: 16.0,
    description: 'Citrus brightness with sweet spice.',
    originCountry: 'Tanzania',
    originFlag: '🇹🇿',
    region: 'Kilimanjaro',
    process: 'Washed',
    variety: 'Bourbon / Kent',
    elevation: '1,600m',
    tastingNotes: 'Orange|Cinnamon|Cocoa',
    roastLevel: 'Medium',
    imageUrl: '/images/stock/coffee-0019-5a777e2e.jpg',
  },
  {
    name: 'Nicaragua Jinotega',
    category: 'coffee',
    price: 14.5,
    description: 'Balanced cocoa, nutty sweetness, gentle acidity.',
    originCountry: 'Nicaragua',
    originFlag: '🇳🇮',
    region: 'Jinotega',
    process: 'Washed',
    variety: 'Caturra',
    elevation: '1,400–1,600m',
    tastingNotes: 'Cocoa|Toasted nut|Mild citrus',
    roastLevel: 'Medium',
    imageUrl: '/images/stock/coffee-0020-28bcb732.jpg',
  },
  {
    name: 'El Salvador Santa Ana',
    category: 'coffee',
    price: 15.0,
    description: 'Sweet caramel and citrus with silky body.',
    originCountry: 'El Salvador',
    originFlag: '🇸🇻',
    region: 'Santa Ana',
    process: 'Washed',
    variety: 'Pacas',
    elevation: '1,500m',
    tastingNotes: 'Caramel|Orange|Milk chocolate',
    roastLevel: 'Medium',
    imageUrl: '/images/stock/coffee-0021-95d74824.jpg',
  },
  {
    name: 'Honduras Copán Honey',
    category: 'coffee',
    price: 15.5,
    description: 'Honey processed sweetness with tropical nuance.',
    originCountry: 'Honduras',
    originFlag: '🇭🇳',
    region: 'Copán',
    process: 'Honey',
    variety: 'Catuai',
    elevation: '1,450m',
    tastingNotes: 'Pineapple|Brown sugar|Cocoa',
    roastLevel: 'Medium',
    imageUrl: '/images/stock/coffee-0022-f2c826e6.jpg',
  },
  {
    name: 'Mexico Chiapas',
    category: 'coffee',
    price: 14.5,
    description: 'Chocolate, almond, and subtle citrus.',
    originCountry: 'Mexico',
    originFlag: '🇲🇽',
    region: 'Chiapas',
    process: 'Washed',
    variety: 'Bourbon',
    elevation: '1,400m',
    tastingNotes: 'Dark chocolate|Almond|Orange peel',
    roastLevel: 'Medium-Dark',
    imageUrl: '/images/stock/coffee-0023-6e419195.jpg',
  },
  {
    name: 'Indonesia Sumatra Lintong',
    category: 'coffee',
    price: 16.5,
    description: 'Herbal, earthy, syrupy body typical of wet-hulled Sumatra.',
    originCountry: 'Indonesia',
    originFlag: '🇮🇩',
    region: 'Lintong',
    process: 'Wet-Hulled',
    variety: 'Catimor / Typica',
    elevation: '1,400m',
    tastingNotes: 'Cedar|Cocoa|Sweet spice',
    roastLevel: 'Medium-Dark',
    imageUrl: '/images/stock/coffee-0024-d590f9d5.jpg',
  },
  {
    name: 'Indonesia Java Honey',
    category: 'coffee',
    price: 16.0,
    description: 'Sweet spice, molasses, and dried fruit.',
    originCountry: 'Indonesia',
    originFlag: '🇮🇩',
    region: 'Java',
    process: 'Honey',
    variety: 'Typica',
    elevation: '1,300m',
    tastingNotes: 'Molasses|Dried plum|Sweet spice',
    roastLevel: 'Medium-Dark',
    imageUrl: '/images/stock/coffee-0025-b29db6dd.jpg',
  },
  {
    name: 'Vietnam Lam Dong Honey',
    category: 'coffee',
    price: 15.0,
    description: 'Honey processed highland arabica with lush sweetness.',
    originCountry: 'Vietnam',
    originFlag: '🇻🇳',
    region: 'Lam Dong',
    process: 'Honey',
    variety: 'Catimor',
    elevation: '1,500m',
    tastingNotes: 'Palm sugar|Ripe mango|Cocoa',
    roastLevel: 'Medium',
    imageUrl: '/images/stock/coffee-0026-3186c7c5.jpg',
  },
  {
    name: 'Vietnam Da Lat Washed',
    category: 'coffee',
    price: 14.5,
    description: 'Clean, sweet cup with floral hints.',
    originCountry: 'Vietnam',
    originFlag: '🇻🇳',
    region: 'Da Lat',
    process: 'Washed',
    variety: 'Typica / Bourbon',
    elevation: '1,500m',
    tastingNotes: 'Floral|Caramel|Stone fruit',
    roastLevel: 'Medium',
    imageUrl: '/images/stock/coffee-0027-667394ab.jpg',
  },
  {
    name: 'Yemen Mokha Matari',
    category: 'coffee',
    price: 24.0,
    description: 'Classic Mokha profile, winey and cocoa-laden.',
    originCountry: 'Yemen',
    originFlag: '🇾🇪',
    region: 'Sanaa',
    process: 'Natural',
    variety: 'Heirloom',
    elevation: '1,900m',
    tastingNotes: 'Cocoa|Dried berry|Winey',
    roastLevel: 'Medium-Dark',
    imageUrl: '/images/stock/coffee-0028-cf7888cd.jpg',
  },
  {
    name: 'Decaf Mountain Water',
    category: 'coffee',
    price: 14.0,
    description: 'Chemical-free decaf with cocoa and almond sweetness.',
    originCountry: 'Mexico',
    originFlag: '🇲🇽',
    region: 'Chiapas',
    process: 'Mountain Water Decaf',
    variety: 'Bourbon',
    elevation: '1,400m',
    tastingNotes: 'Cocoa|Almond|Brown sugar',
    roastLevel: 'Medium',
    imageUrl: '/images/stock/coffee-0029-13ed933f.jpg',
  },
];

const preparedBeans = beans.map((bean) => ({
  ...bean,
  slug: slugify(bean.name),
  flavorTags: bean.flavorTags || bean.tastingNotes,
}));

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    const menuItems = await MenuItem.bulkCreate(preparedBeans, { validate: true });
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 10);
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      passwordHash: adminPassword,
      role: 'admin',
    });
    const userPassword = await bcrypt.hash('1234', 10);
    const customer = await User.create({
      name: 'User',
      email: 'user@123.com',
      passwordHash: userPassword,
      role: 'customer',
    });

    // Create sample customers for demo orders
    const sampleCustomers = [];
    const customerNames = [
      { name: 'Sarah Johnson', email: 'sarah.j@email.com' },
      { name: 'Michael Chen', email: 'mchen@email.com' },
      { name: 'Emily Davis', email: 'emily.d@email.com' },
      { name: 'James Wilson', email: 'jwilson@email.com' },
      { name: 'Olivia Martinez', email: 'olivia.m@email.com' },
    ];
    for (const cust of customerNames) {
      const pw = await bcrypt.hash('demo1234', 10);
      const u = await User.create({ ...cust, passwordHash: pw, role: 'customer' });
      sampleCustomers.push(u);
    }

    // Sample addresses
    const addresses = [
      '123 Coffee Lane, Portland, OR 97201',
      '456 Brew Street, Seattle, WA 98101',
      '789 Roast Ave, San Francisco, CA 94102',
      '321 Espresso Blvd, Los Angeles, CA 90012',
      '654 Latte Way, Austin, TX 78701',
    ];

    // Order statuses
    const statuses = ['pending', 'confirmed', 'shipped', 'completed', 'cancelled'];

    // Create orders across the last 30 days
    const orders = [];
    const now = new Date();
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      // 1–4 orders per day
      const ordersToday = Math.floor(Math.random() * 4) + 1;
      for (let o = 0; o < ordersToday; o++) {
        const orderDate = new Date(now);
        orderDate.setDate(now.getDate() - dayOffset);
        orderDate.setHours(Math.floor(Math.random() * 12) + 8);
        orderDate.setMinutes(Math.floor(Math.random() * 60));

        const cust = sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)];
        const addr = addresses[Math.floor(Math.random() * addresses.length)];

        // Older orders more likely to be completed
        let status;
        if (dayOffset > 14) {
          status = Math.random() < 0.8 ? 'completed' : 'cancelled';
        } else if (dayOffset > 7) {
          status = ['shipped', 'completed'][Math.floor(Math.random() * 2)];
        } else if (dayOffset > 2) {
          status = ['confirmed', 'shipped'][Math.floor(Math.random() * 2)];
        } else {
          status = ['pending', 'confirmed'][Math.floor(Math.random() * 2)];
        }

        // Random 1–4 items
        const itemCount = Math.floor(Math.random() * 4) + 1;
        const chosenItems = [];
        const usedIds = new Set();
        for (let i = 0; i < itemCount; i++) {
          let item;
          do {
            item = menuItems[Math.floor(Math.random() * menuItems.length)];
          } while (usedIds.has(item.id));
          usedIds.add(item.id);
          chosenItems.push({
            menuItem: item,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: item.price,
          });
        }

        const total = chosenItems.reduce((sum, ci) => sum + ci.price * ci.quantity, 0);

        orders.push({
          userId: cust.id,
          status,
          total,
          shippingAddress: addr,
          createdAt: orderDate,
          updatedAt: orderDate,
          items: chosenItems,
        });
      }
    }

    // Persist orders and order items
    for (const ord of orders) {
      const order = await Order.create({
        userId: ord.userId,
        status: ord.status,
        total: ord.total,
        shippingAddress: ord.shippingAddress,
        createdAt: ord.createdAt,
        updatedAt: ord.updatedAt,
      });
      for (const item of ord.items) {
        await OrderItem.create({
          orderId: order.id,
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          price: item.price,
        });
      }
    }

    console.log(`✅ Seeded ${preparedBeans.length} specialty coffees, ${sampleCustomers.length + 2} users, and ${orders.length} orders.`);
  } catch (error) {
    console.error('❌ Failed to seed beans:', error.message);
  } finally {
    await sequelize.close();
  }
};

seed();
