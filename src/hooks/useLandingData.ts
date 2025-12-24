import { useCallback, useEffect, useState } from "react";

export type LandingMenuItem = {
  id: number;
  slug: string;
  name: string;
  category: string;
  originCountry?: string;
  originFlag?: string;
  originBadge?: string;
  region?: string;
  roast?: string;
  roastLevel?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  variety?: string;
  elevation?: string;
  process?: string;
  tastingNotes?: string[];
  flavorTags?: string[];
  tags?: string[];
  isAvailable?: boolean;
};

export type LandingSection = {
  key: string;
  title: string;
  subtitle?: string;
  story?: string;
  heroImage?: string;
  items: LandingMenuItem[];
};

export type HeroStat = {
  label: string;
  value: string;
  caption?: string;
};

export type JournalPreview = {
  title: string;
  excerpt?: string;
  summary?: string;
  subtitle?: string;
  slug: string;
  imageUrl?: string;
};

export type LandingData = {
  heroStats: HeroStat[];
  sectionHighlights: LandingSection[];
  highlightCoffees: LandingMenuItem[];
  journalPreview: JournalPreview[];
  featuredItems: LandingMenuItem[];
  generatedAt?: string;
  totals?: {
    availableItems?: number;
    beanHighlights?: number;
  };
};

export interface UseLandingDataResult {
  data: LandingData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const fetchLandingData = async (signal?: AbortSignal): Promise<LandingData> => {
  const response = await fetch("/api/menu/landing", { signal });
  if (!response.ok) {
    throw new Error("Unable to load landing content.");
  }
  return response.json();
};

export function useLandingData(): UseLandingDataResult {
  const [data, setData] = useState<LandingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(
    async (options?: { signal?: AbortSignal; silent?: boolean }) => {
      if (!options?.silent) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const payload = await fetchLandingData(options?.signal);
        setData(payload);
      } catch (err) {
        if (options?.signal?.aborted) {
          return;
        }
        const message = err instanceof Error ? err.message : "Unable to load landing content.";
        setError(message);
      } finally {
        if (!options?.signal?.aborted && !options?.silent) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    loadData({ signal: controller.signal });
    return () => controller.abort();
  }, [loadData]);

  const refetch = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return { data, isLoading, error, refetch };
}
