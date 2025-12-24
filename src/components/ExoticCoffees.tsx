import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sparkles } from "lucide-react";
import type { LandingMenuItem, LandingSection, UseLandingDataResult } from "../hooks/useLandingData";

const rarityLabels = ["Ultra Rare", "Limited Edition", "Micro-lot Reserve"];

const pickExoticSection = (sectionHighlights?: LandingSection[]): LandingSection | null => {
  if (!sectionHighlights || sectionHighlights.length === 0) {
    return null;
  }
  return (
    sectionHighlights.find((section) => section.key === "seasonal") ||
    sectionHighlights.find((section) => section.key === "beans") ||
    sectionHighlights.find((section) => section.items.length >= 3) ||
    sectionHighlights[0]
  );
};

const getFlavorTokens = (coffee: LandingMenuItem) => {
  if (coffee.tastingNotes && coffee.tastingNotes.length) {
    return coffee.tastingNotes;
  }
  if (coffee.flavorTags && coffee.flavorTags.length) {
    return coffee.flavorTags;
  }
  return coffee.tags ?? [];
};

const formatPrice = (value?: number) => {
  if (!Number.isFinite(value)) {
    return "Market Price";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value as number);
};

const renderSkeletons = () => (
  <>
    {[...Array(3)].map((_, index) => (
      <div
        key={`exotic-skeleton-${index}`}
        className="bg-neutral-900 border border-dashed border-neutral-800 h-[520px] animate-pulse"
      />
    ))}
  </>
);

interface ExoticCoffeesProps {
  landing: UseLandingDataResult;
}

export function ExoticCoffees({ landing }: ExoticCoffeesProps) {
  const section = pickExoticSection(landing.data?.sectionHighlights);
  const coffees = section ? section.items.slice(0, 3) : [];

  return (
    <section id="exotic" className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-orange-500" />
            <h2 className="text-6xl md:text-7xl" style={{
              fontFamily: "serif",
              fontWeight: 400,
              letterSpacing: "0.05em",
            }}>
              Exotic<br className="md:hidden" /> Collection
            </h2>
            <Sparkles className="w-8 h-8 text-orange-500" />
          </div>
          <div className="w-24 h-1 bg-orange-600 mx-auto mb-6"></div>
          <p className="text-neutral-400 max-w-2xl mx-auto mb-4">
            Pulled live from the seasonal and reserve categories. These micro-lots are available only
            while inventory lasts.
          </p>
          <Badge className="bg-orange-600 text-white">
            {section ? `${coffees.length} Live Release${coffees.length === 1 ? "" : "s"}` : "Profiling in progress"}
          </Badge>
        </div>

        {landing.error && (
          <div className="max-w-4xl mx-auto mb-10 border border-red-500 bg-red-950/30 text-red-200 px-6 py-4">
            {landing.error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {landing.isLoading && coffees.length === 0 && renderSkeletons()}
          {!landing.isLoading && coffees.length === 0 && !landing.error && (
            <div className="col-span-full bg-neutral-900 border border-dashed border-neutral-800 p-10 text-center text-neutral-400">
              No reserve lots are available right now. Join the waitlist below to be the first to know
              when the next release drops.
            </div>
          )}

          {coffees.map((coffee, index) => (
            <div
              key={coffee.slug || coffee.id}
              className="group relative bg-neutral-900 border border-neutral-800 hover:border-orange-600 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-orange-600 text-white">
                  {rarityLabels[index] || "Limited Release"}
                </Badge>
              </div>

              <div className="relative landing-card-media overflow-hidden">
                <ImageWithFallback
                  src={coffee.imageUrl}
                  alt={coffee.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-3xl mb-2">{coffee.name}</h3>
                  <p className="text-orange-400 text-sm mb-1">{coffee.originBadge || coffee.originCountry}</p>
                  <p className="text-neutral-400 text-sm">{coffee.process || "Meticulous process"}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {getFlavorTokens(coffee).slice(0, 4).map((note) => (
                    <Badge
                      key={`${coffee.slug}-${note}`}
                      variant="outline"
                      className="border-orange-600 text-orange-400 bg-orange-950/30"
                    >
                      {note}
                    </Badge>
                  ))}
                </div>

                <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                  {coffee.description || section?.story || "Hyper-limited experimental lot straight from the lab."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                  <span className="text-2xl text-orange-500">{formatPrice(coffee.price)}</span>
                  <Button className="bg-orange-600 text-white hover:bg-orange-700">
                    Pre-Order
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" className="border-orange-600 text-orange-500 hover:bg-orange-600 hover:text-white">
            Join Waitlist for Future Releases
          </Button>
        </div>
      </div>
    </section>
  );
}
