const addFlash = (req, type, message) => {
  const existing = req.session.flash || [];
  existing.push({ type, message });
  req.session.flash = existing;
};

module.exports = { addFlash };
