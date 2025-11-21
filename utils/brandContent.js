const sectionMeta = {
  coffee: {
    title: 'Signature Coffees',
    subtitle: 'Daily staples roasted for clarity and balance.',
    story:
      'Clean, syrupy extractions anchored by layered sweetness for the everyday pour over or espresso.',
    heroImage:
      'https://images.unsplash.com/photo-1473929737295-4268b2e817ab?auto=format&fit=crop&w=1400&q=80',
    origin: 'Hue Highlands · Vietnam',
    tastingNotes: ['Pomelo zest', 'Amber honey', 'Roasted almond'],
    brewTips: '22g in · 40g out espresso, 28 seconds. Pour overs shine at 1:16 with 94°C water.',
    articleBody: [
      'Our signature profiles lean on extended Maillard time to coax caramelized sweetness without muting florals.',
      'Each lot is cupped daily to keep the roast curve aligned with humidity shifts, ensuring clarity in your cup.',
    ],
  },
  beans: {
    title: 'Single-Origin Beans',
    subtitle: 'Traceable, seasonal lots with terroir-driven profiles.',
    story:
      'Limited drops sourced alongside producers we have visited for over a decade, roasted to spotlight terroir.',
    heroImage:
      'https://images.unsplash.com/photo-1503481766315-7a586b20f66d?auto=format&fit=crop&w=1400&q=80',
    origin: 'Yirgacheffe · Ethiopia',
    tastingNotes: ['Bergamot', 'Golden peach', 'Chamomile'],
    brewTips: 'Best at 1:15 ratio on V60 with 3-pour structure, finish at 2:45.',
    articleBody: [
      'We buy micro-lots directly and pay quality premiums so farmers can reinvest in processing innovation.',
      'Expect vibrant acidity, tea-like textures, and transparent sweetness that rewards careful brewing.',
    ],
  },
  seasonal: {
    title: 'Seasonal Limited',
    subtitle: 'Small runs showcasing experimental processing.',
    story:
      'Playful, fast-moving releases exploring anaerobic, thermal shock, and honey processes.',
    heroImage:
      'https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=1400&q=80',
    origin: 'Caldas · Colombia',
    tastingNotes: ['Blackberry jam', 'Cacao nib', 'Sweet basil'],
    brewTips: 'Bloom generously and pull shorter brews to showcase the texture.',
    articleBody: [
      'Seasonal lots are profiled in tiny batches and cupped with the producers over video to calibrate sweetness.',
      'We publish roast curves and recipe notes with each drop so you can follow along at home.',
    ],
  },
  tea: {
    title: 'Slow-Steeped Teas',
    subtitle: 'Comforting infusions for the afternoon pause.',
    story:
      'Sourced from small farms crafting hand-rolled oolongs and sun-withered whites to complement our coffees.',
    heroImage:
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1400&q=80',
    origin: 'Ali Shan · Taiwan',
    tastingNotes: ['Milk candy', 'Gardenia', 'Winter melon'],
    brewTips: '90°C water, 4g per 120ml in porcelain, flash rinse, infuse 45 seconds.',
    articleBody: [
      'We lean on partners who grow and craft in micro-terroirs, resulting in teas that feel plush and calming.',
      'Each tea ships with a ceremonial card that walks through temperature, vessel, and aroma cues.',
    ],
  },
  bakery: {
    title: 'Bakes & Pairings',
    subtitle: 'Thoughtful pastry companions for every cup.',
    story:
      'Naturally leavened pastries and pantry treats developed with our culinary team for mindful pairing.',
    heroImage:
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1400&q=80',
    origin: 'St. Joseph Street · Hanoi',
    tastingNotes: ['Toasted sesame', 'Wildflower honey', 'Stone fruit jam'],
    brewTips: 'Serve warm, finish with a drizzle of orange blossom syrup.',
    articleBody: [
      'Our pastry lab works alongside the roasting team to build textures that mirror each release.',
      'Menus rotate weekly with laminated viennoiserie, mochi cakes, and vegan treats built on heirloom grains.',
    ],
  },
};

const roastStories = Object.entries(sectionMeta).map(([key, meta]) => ({
  key,
  slug: `${key}-journal`,
  title: meta.title,
  subtitle: meta.subtitle,
  heroImage: meta.heroImage,
  summary: meta.story,
  origin: meta.origin,
  tastingNotes: meta.tastingNotes,
  brewTips: meta.brewTips,
  body: meta.articleBody,
}));

module.exports = { sectionMeta, roastStories };
