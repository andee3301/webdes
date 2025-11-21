const { roastStories } = require('../utils/brandContent');

exports.getAbout = (req, res) => {
  const studioValues = [
    {
      title: 'Transparent sourcing',
      detail: 'We publish every producer partner and the premiums we pay to keep the value chain open.',
    },
    {
      title: 'Intentional roasting',
      detail: 'Every batch is logged, cupped, and shared with the producer for continual calibration.',
    },
    {
      title: 'Daily ritual support',
      detail: 'Brew guides, service training, and hotline chats so your cup feels effortless.',
    },
  ];

  const timeline = [
    { year: '2012', title: 'Origins in the Highlands', note: 'Learning harvest cues and processing with family farms.' },
    { year: '2017', title: 'Lab + Roastery Opens', note: 'Our Hanoi roastery launches with a 12kg Loring and cupping lab.' },
    { year: '2021', title: 'Producer Residency', note: 'Hosts partners in-house to roast, taste, and build new profiles.' },
  ];

  res.render('about', {
    pageTitle: 'About · Andy Roasting Co.',
    studioValues,
    timeline,
    featuredStories: roastStories.slice(0, 3),
  });
};

exports.getJournal = (req, res) => {
  res.render('blog/index', {
    pageTitle: 'Journal · Andy Roasting Co.',
    posts: roastStories,
  });
};
