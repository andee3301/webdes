const { MenuItem, Review, User } = require('../models');
const { sectionMeta, roastStories } = require('../utils/brandContent');
const {
  normalizeMenuItem,
  selectFeaturedItems,
  groupMenuByCategory,
} = require('../utils/menuFormatting');

const buildMenuItemPayload = (item) => ({
  id: item.id,
  slug: item.slug,
  name: item.name,
  category: item.category,
  originCountry: item.originCountry,
  originFlag: item.originFlag,
  originBadge: item.originBadge,
  region: item.displayRegion || item.region,
  roast: item.displayRoast,
  roastLevel: item.roastLevel,
  price: item.priceValue,
  description: item.description,
  imageUrl: item.imageUrl,
  variety: item.variety,
  elevation: item.elevation,
  process: item.process,
  tastingNotes: item.noteList,
  flavorTags: item.tagList,
  tags: item.tags,
  isAvailable: item.isAvailable,
});

const buildFeaturedPayload = (item) => buildMenuItemPayload(item);

exports.getFeatured = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 6, 12);
    const items = await MenuItem.findAll({
      where: { isAvailable: true },
      order: [
        ['updatedAt', 'DESC'],
        ['name', 'ASC'],
      ],
      limit: 24,
    });
    const normalized = items.map(normalizeMenuItem);
    const featured = selectFeaturedItems(normalized, limit);
    res.json({
      featured: featured.map(buildFeaturedPayload),
      generatedAt: new Date().toISOString(),
      totalAvailable: normalized.length,
    });
  } catch (error) {
    next(error);
  }
};

exports.getLandingData = async (req, res, next) => {
  try {
    const items = await MenuItem.findAll({
      where: { isAvailable: true },
      order: [
        ['category', 'ASC'],
        ['name', 'ASC'],
      ],
    });

    const normalizedItems = items.map(normalizeMenuItem);
    const menu = groupMenuByCategory(normalizedItems);
    const beanPool = normalizedItems.filter(
      (item) => item.category === 'coffee' || item.category === 'beans'
    );
    const featuredItems = selectFeaturedItems(beanPool, 4);

    const heroStats = [
      { label: 'Roasts / week', value: '12', caption: 'Dialed in every morning.' },
      { label: 'Origins on bar', value: '6', caption: 'Guided by harvest calendars.' },
      { label: 'Lead time', value: '< 48h', caption: 'Rested, packed, delivered.' },
    ];

    const sectionHighlights = Object.keys(sectionMeta)
      .map((key) => {
        const section = sectionMeta[key] || {};
        return {
          key,
          title: section.title || key,
          subtitle: section.subtitle || section.origin || '',
          story: section.story,
          heroImage: section.heroImage,
          items: (menu[key] || []).slice(0, 4).map(buildMenuItemPayload),
        };
      })
      .filter((section) => section.items.length > 0);

    const beanHighlights = (menu.beans && menu.beans.length ? menu.beans : menu.coffee) || [];
    const highlightCoffees = beanHighlights.slice(0, 4).map(buildMenuItemPayload);
    const journalPreview = roastStories.slice(0, 2);

    res.json({
      heroStats,
      sectionHighlights,
      highlightCoffees,
      journalPreview,
      featuredItems: featuredItems.map(buildMenuItemPayload),
      generatedAt: new Date().toISOString(),
      totals: {
        availableItems: normalizedItems.length,
        beanHighlights: beanHighlights.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMenuItem = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const item = await MenuItem.findOne({
      where: { slug },
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
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const normalized = normalizeMenuItem(item);
    const reviews = (item.reviews || []).map((review) => ({
      id: review.id,
      rating: Number(review.rating) || 0,
      note: review.note,
      createdAt: review.createdAt,
      author: review.user ? { id: review.user.id, name: review.user.name } : null,
    }));
    const reviewCount = reviews.length;
    const avgRating =
      reviewCount > 0
        ? Number(
            (
              reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
              reviewCount
            ).toFixed(1)
          )
        : null;

    res.json({
      item: {
        ...normalized,
        price: normalized.priceValue,
        heroStory: sectionMeta[normalized.category] || null,
        journalPreview: roastStories.slice(0, 2),
        reviews,
        reviewSummary: {
          count: reviewCount,
          average: avgRating,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
