const { sectionMeta } = require('./brandContent');

const splitTokens = (value) => {
  if (!value) return [];
  const raw = String(value);
  const delimiter = raw.includes('|') ? '|' : ',';
  return raw
    .split(delimiter)
    .map((token) => token.trim())
    .filter(Boolean);
};

const normalizeMenuItem = (item) => {
  const data = item?.get ? item.get({ plain: true }) : { ...item };
  data.tagList = splitTokens(data.flavorTags);
  const tastingTokens = splitTokens(data.tastingNotes);
  data.noteList = tastingTokens.length
    ? tastingTokens
    : data.tastingNotes
    ? [data.tastingNotes]
    : [];
  data.displayRoast = data.roastLevel || 'Medium Roast';
  data.displayRegion = data.region || data.originCountry;
  const meta = sectionMeta[data.category] || {};
  const originLabel = data.originCountry || meta.origin || 'Origin country';
  data.originBadge = data.originFlag ? `${data.originFlag} ${originLabel}`.trim() : originLabel;
  data.variety = data.variety || 'Blend';
  data.elevation = data.elevation || '1,600–1,850m';
  data.tags = data.noteList.length
    ? data.noteList
    : data.tagList.length
    ? data.tagList
    : ['Caramel', 'Orange', 'Almond'];
  const numericPrice = Number(data.price);
  data.priceValue = Number.isFinite(numericPrice) ? numericPrice : 0;
  data.displayPrice = data.priceValue.toFixed(2);
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

const selectFeaturedItems = (items, limit = 6) => {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, limit);
};

module.exports = {
  splitTokens,
  normalizeMenuItem,
  groupMenuByCategory,
  selectFeaturedItems,
};
