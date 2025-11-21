const { Op } = require('sequelize');
const { MenuItem, Review, WishlistItem, User } = require('../models');
const { addFlash } = require('../utils/flash');
const { sectionMeta, roastStories } = require('../utils/brandContent');

const splitTokens = (value) => {
  if (!value) return [];
  const raw = String(value);
  if (raw.includes('|')) {
    return raw
      .split('|')
      .map((token) => token.trim())
      .filter(Boolean);
  }
  return raw
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);
};

const normalizeMenuItem = (item) => {
  const data = item.get ? item.get({ plain: true }) : { ...item };
  data.tagList = splitTokens(data.flavorTags);
  const tastingTokens = splitTokens(data.tastingNotes);
  data.noteList = tastingTokens.length ? tastingTokens : data.tastingNotes ? [data.tastingNotes] : [];
  data.displayRoast = data.roastLevel || 'Medium Roast';
  data.displayRegion = data.region || data.originCountry;
  const meta = sectionMeta[data.category] || {};
  const originLabel = data.originCountry || meta.origin || 'Origin country';
  data.originBadge = data.originFlag
    ? `${data.originFlag} ${originLabel}`.trim()
    : originLabel;
  data.variety = data.variety || 'Blend';
  data.elevation = data.elevation || '1,600–1,850m';
  data.tags = data.noteList.length
    ? data.noteList
    : data.tagList.length
    ? data.tagList
    : ['Caramel', 'Orange', 'Almond'];
  return data;
};

const groupMenuByCategory = (items) => {
  const grouped = { coffee: [], beans: [], tea: [], bakery: [], seasonal: [] };
  items.forEach((item) => {
    const key = item.category || 'featured';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });
  return grouped;
};

exports.getHome = async (req, res) => {
  const items = await MenuItem.findAll({
    where: { isAvailable: true },
    order: [
      ['category', 'ASC'],
      ['name', 'ASC'],
    ],
  });
  const normalizedItems = items.map(normalizeMenuItem);
  const menu = groupMenuByCategory(normalizedItems);
  const beanPool = normalizedItems.filter((c) => c.category === 'coffee' || c.category === 'beans');
  const featuredItems = [...beanPool].sort(() => 0.5 - Math.random()).slice(0, 6);
  const heroStats = [
    { label: 'Roasts / week', value: '12', caption: 'Dialed in every morning.' },
    { label: 'Origins on bar', value: '6', caption: 'Guided by harvest calendars.' },
    { label: 'Lead time', value: '< 48h', caption: 'Rested, packed, delivered.' },
  ];
  const sectionHighlights = Object.keys(sectionMeta).map((key) => ({
    key,
    title: sectionMeta[key].title,
    subtitle: sectionMeta[key].subtitle,
    story: sectionMeta[key].story,
    heroImage: sectionMeta[key].heroImage,
    items: (menu[key] || []).slice(0, 3),
  }));
  const beanHighlights = (menu.beans && menu.beans.length ? menu.beans : menu.coffee) || [];
  const highlightCoffees = beanHighlights.slice(0, 4);
  const journalPreview = roastStories.slice(0, 2);

  res.render('home', {
    pageTitle: 'Andy Roasting Co.',
    menu,
    heroStats,
    sectionHighlights,
    journalPreview,
    highlightCoffees,
    featuredItems,
  });
};

exports.getShop = async (req, res) => {
  const items = await MenuItem.findAll({
    where: {
      isAvailable: true,
    },
    order: [
      ['category', 'ASC'],
      ['name', 'ASC'],
    ],
  });
  const normalizedItems = items.map(normalizeMenuItem);
  const query = (req.query.q || '').trim();
  const filteredItems = query
    ? normalizedItems.filter((item) => {
        const haystack = [
          item.name,
          item.description,
          item.tastingNotes,
          item.flavorTags,
          item.tagList.join(' '),
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(query.toLowerCase());
      })
    : normalizedItems;

  const grouped = filteredItems.reduce((acc, item) => {
    const key = item.category || 'coffee';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const sectionOrder = ['coffee', 'beans', 'seasonal', 'tea', 'bakery'];
  const shopSections = sectionOrder
    .filter((key) => grouped[key] && grouped[key].length)
    .map((key) => ({
      key,
      title: sectionMeta[key]?.title || key,
      subtitle: sectionMeta[key]?.subtitle || 'Crafted in-house daily.',
      story: sectionMeta[key]?.story,
      heroImage: sectionMeta[key]?.heroImage,
      items: grouped[key],
    }));

  const hasSections = shopSections.length > 0;
  res.render('shop/index', {
    pageTitle: 'Shop coffee',
    shopSections,
    hasSections,
    spotlightStories: roastStories,
    activeQuery: query,
    searchApplied: Boolean(query),
    searchCount: filteredItems.length,
  });
};

exports.getMenuItem = async (req, res) => {
  const { id } = req.params;
  const item = await MenuItem.findByPk(id, {
    include: [
      {
        model: Review,
        as: 'reviews',
        where: { status: 'approved' },
        required: false,
        include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      },
    ],
    order: [[{ model: Review, as: 'reviews' }, 'createdAt', 'DESC']],
  });

  if (!item) {
    addFlash(req, 'error', 'Menu item not found.');
    return res.redirect('/');
  }

  const reviews = item.reviews || [];
  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? (
          reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviewCount
        ).toFixed(1)
      : null;

  let isWishlisted = false;
  if (req.user) {
    const existing = await WishlistItem.findOne({
      where: { userId: req.user.id, menuItemId: item.id },
    });
    isWishlisted = !!existing;
  }

  return res.render('menu/detail', {
    pageTitle: item.name,
    item,
    reviews,
    reviewCount,
    avgRating,
    isWishlisted,
  });
};
