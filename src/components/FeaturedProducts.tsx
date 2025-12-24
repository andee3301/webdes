import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

type FeaturedProduct = {
  id: number;
  slug: string;
  name: string;
  category: string;
  originCountry?: string;
  originFlag?: string;
  region?: string;
  roast: string;
  roastLevel?: string;
  price: number;
  description?: string;
  imageUrl?: string;
  variety?: string;
  elevation?: string;
  process?: string;
  tastingNotes?: string[];
  flavorTags?: string[];
  tags?: string[];
};

const formatPrice = (value?: number) => {
  if (!value && value !== 0) return "$0.00";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    console.error("Failed to format price", error);
    return `$${value?.toFixed(2) ?? "0.00"}`;
  }
};

export function FeaturedProducts() {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/menu/featured?limit=6", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Unable to load featured coffees.");
        }
        const payload = await response.json();
        setProducts(Array.isArray(payload.featured) ? payload.featured : []);
        setError(null);
      } catch (err) {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : "Unable to load featured coffees.";
        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();
    return () => controller.abort();
  }, []);

  const toggleWishlist = (productSlug: string) => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productSlug)) {
        newSet.delete(productSlug);
      } else {
        newSet.add(productSlug);
      }
      return newSet;
    });
  };

  const renderFlavorBadges = (product: FeaturedProduct) => {
    const flavors = product.tastingNotes?.length
      ? product.tastingNotes
      : product.flavorTags?.length
      ? product.flavorTags
      : product.tags ?? [];
    return flavors.slice(0, 4).map((flavor) => (
      <Badge
        key={`${product.slug}-${flavor}`}
        variant="outline"
        className="border-orange-600 text-orange-700 bg-orange-50"
      >
        {flavor}
      </Badge>
    ));
  };

  const renderSkeletonCards = () => (
    <>
      {[...Array(3)].map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="group bg-white border border-neutral-200 overflow-hidden animate-pulse"
        >
          <div className="h-64 bg-neutral-100" />
          <div className="p-6 space-y-4">
            <div className="h-6 bg-neutral-200 w-3/4" />
            <div className="h-4 bg-neutral-200 w-1/2" />
            <div className="flex gap-2">
              <div className="h-4 bg-neutral-200 flex-1" />
              <div className="h-4 bg-neutral-200 flex-1" />
            </div>
            <div className="h-20 bg-neutral-100" />
            <div className="h-10 bg-neutral-900" />
          </div>
        </div>
      ))}
    </>
  );

  return (
    <section id="shop" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl mb-4">Featured Coffees</h2>
          <div className="w-24 h-1 bg-orange-600 mx-auto mb-6"></div>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Single-origin coffees from around the world, expertly roasted by Dinh Phong
          </p>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-10 border border-red-200 bg-red-50 text-red-700 px-6 py-4">
            {error}
          </div>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {isLoading && products.length === 0 && renderSkeletonCards()}
          {!isLoading && products.length === 0 && (
            <div className="col-span-full">
              <div className="bg-neutral-50 border border-dashed border-neutral-200 p-10 text-center text-neutral-500">
                Fresh coffees are being profiled. Check back soon.
              </div>
            </div>
          )}
          {products.map((product) => (
            <div key={product.slug} className="group bg-white border border-neutral-200 hover:border-orange-600 transition-all duration-300 overflow-hidden">
              <div className="relative landing-card-media overflow-hidden bg-neutral-100">
                  <ImageWithFallback
                  src={product.imageUrl ?? undefined}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <button 
                  onClick={() => toggleWishlist(product.slug)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                >
                  <Heart 
                    className={`w-5 h-5 ${wishlist.has(product.slug) ? 'fill-orange-600 text-orange-600' : 'text-neutral-600'}`} 
                  />
                </button>
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-sm">
                  {product.roast || product.roastLevel || "Seasonal"} Roast
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-2xl mb-2">{product.name}</h3>
                  <p className="text-sm text-neutral-600 flex items-center gap-2">
                    <span className="text-xl">{product.originFlag || "🌍"}</span>
                    {[product.region, product.originCountry].filter(Boolean).join(", ") || "Single-origin release"}
                  </p>
                </div>
                
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Cultivar:</span>
                    <span className="text-neutral-800">{product.variety || "Blend"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Altitude:</span>
                    <span className="text-neutral-800">{product.elevation || "1,600m"}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {renderFlavorBadges(product)}
                </div>
                
                <p className="text-sm text-neutral-700 leading-relaxed mb-6">
                  {product.description || "Hand-roasted daily for clarity and sweetness."}
                </p>
                
                <div className="flex items-center gap-2 pt-4 border-t border-neutral-200">
                  <Button className="flex-1 bg-black text-white hover:bg-orange-600 transition-colors">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {formatPrice(product.price)}
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
