import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { LandingMenuItem, UseLandingDataResult } from "../hooks/useLandingData";

interface CoffeeGridProps {
  landing: UseLandingDataResult;
}

const formatPrice = (value?: number) => {
  if (!Number.isFinite(value)) {
    return "$0.00";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value as number);
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

const renderSkeletonCards = () => (
  <>
    {[...Array(6)].map((_, index) => (
      <div
        key={`coffee-skeleton-${index}`}
        className="group bg-white overflow-hidden border border-dashed border-neutral-200 animate-pulse"
      >
        <div className="h-96 bg-neutral-100" />
        <div className="p-8 space-y-4">
          <div className="h-6 bg-neutral-200 w-2/3" />
          <div className="h-4 bg-neutral-200 w-1/3" />
          <div className="h-4 bg-neutral-200 w-1/2" />
          <div className="h-8 bg-neutral-100" />
        </div>
      </div>
    ))}
  </>
);

const regionLabel = (coffee: LandingMenuItem) => {
  const parts = [coffee.region, coffee.originCountry].filter(Boolean);
  return parts.join(", ") || coffee.category;
};

export function CoffeeGrid({ landing }: CoffeeGridProps) {
  const coffees = landing.data?.highlightCoffees ?? [];

  return (
    <section id="shop" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl mb-6">Our Current Selection</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Each coffee is sourced from the live menu and roasted to highlight its terroir.
          </p>
        </div>

        {landing.error && (
          <div className="max-w-4xl mx-auto mb-10 border border-red-200 bg-red-50 text-red-700 px-6 py-4">
            {landing.error}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {landing.isLoading && coffees.length === 0 && renderSkeletonCards()}
          {!landing.isLoading && coffees.length === 0 && !landing.error && (
            <div className="col-span-full bg-white border border-dashed border-neutral-200 p-10 text-center text-neutral-500">
              Our roasting schedule is being updated. Check back shortly for fresh releases.
            </div>
          )}

          {coffees.map((coffee) => (
            <div
              key={coffee.slug || coffee.id}
              className="group bg-white overflow-hidden border border-neutral-200 hover:border-orange-600 transition-all"
            >
              <div className="relative landing-card-media overflow-hidden bg-neutral-100">
                <ImageWithFallback
                  src={coffee.imageUrl}
                  alt={coffee.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-sm">
                  {coffee.roast || coffee.roastLevel || "Seasonal Roast"}
                </div>
              </div>

              <div className="p-8 space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                    <span>{coffee.originBadge || coffee.originCountry || "Single origin"}</span>
                  </div>
                  <h3 className="text-2xl mb-1">{coffee.name}</h3>
                  <p className="text-neutral-600">{regionLabel(coffee)}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {getFlavorTokens(coffee).slice(0, 4).map((note) => (
                    <Badge key={`${coffee.slug}-${note}`} variant="outline" className="border-orange-200 text-orange-700">
                      {note}
                    </Badge>
                  ))}
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed">
                  {coffee.description || "Hand-roasted to order for clarity and sweetness."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <p className="text-2xl text-amber-900">{formatPrice(coffee.price)}</p>
                  <Button variant="outline" size="sm" className="border-neutral-300 text-neutral-900">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
