import type { LandingMenuItem } from "../hooks/useLandingData";

export const flavorTokens = (item: LandingMenuItem) => {
  if (item.tastingNotes && item.tastingNotes.length) return item.tastingNotes;
  if (item.flavorTags && item.flavorTags.length) return item.flavorTags;
  return item.tags ?? [];
};

export const regionLabel = (item: LandingMenuItem) => {
  const parts = [item.region, item.originCountry].filter(Boolean);
  return parts.join(", ") || item.originBadge || item.category || "Single origin";
};
