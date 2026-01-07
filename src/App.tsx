import { useMemo } from "react";
import { ArrowRight, Award, Quote } from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { CardCollection } from "./components/CardCollection";
import { useLandingData, LandingMenuItem, LandingSection } from "./hooks/useLandingData";
import { formatPrice } from "./utils/format";
import { flavorTokens, regionLabel } from "./utils/landing";

const fallbackProductImages = [
  "https://images.unsplash.com/photo-1459257868276-5e65389e2722?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1400&q=80",
];

const sectionImageFallbacks: Record<string, string> = {
  coffee: "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=1400&q=80",
  beans: "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?auto=format&fit=crop&w=1400&q=80",
  bakery: "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=1400&q=80",
  seasonal: "https://images.unsplash.com/photo-1471421298428-1513ab720a8e?auto=format&fit=crop&w=1400&q=80",
  tea: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=1400&q=80",
  default: "https://images.unsplash.com/photo-1502462041640-5625e0a0b973?auto=format&fit=crop&w=1400&q=80",
};

const heroGalleryFallbacks = [
  {
    src: "https://images.unsplash.com/photo-1471421298428-1513ab720a8e?auto=format&fit=crop&w=1400&q=80",
    label: "Seasonal pour-over",
    badge: "Origin reserve",
  },
  {
    src: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=1400&q=80",
    label: "Library roast lab",
    badge: "Brew bar",
  },
  {
    src: "https://images.unsplash.com/photo-1459257868276-5e65389e2722?auto=format&fit=crop&w=1400&q=80",
    label: "Analog tasting notes",
    badge: "Handwritten",
  },
  {
    src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1400&q=80",
    label: "Roaster charge",
    badge: "Probat",
  },
  {
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80",
    label: "Dialing espresso",
    badge: "Bar shift",
  },
];

const getFallbackProductImage = (index: number) =>
  fallbackProductImages[index % fallbackProductImages.length];

const fallbackStats = [
  { label: "Roasts / week", value: "12", caption: "Dialed in every morning." },
  { label: "Origins on bar", value: "6", caption: "Guided by harvest calendars." },
  { label: "Lead time", value: "< 48h", caption: "Rested, packed, delivered." },
];

type OrderPreviewItem = {
  name: string;
  detail: string;
  price: number;
};

function HeroSection({
  heroFeature,
  stats,
}: {
  heroFeature: LandingMenuItem | null;
  stats: { label: string; value: string; caption?: string }[];
}) {
  const galleryShots = heroGalleryFallbacks.map((shot, index) => {
    if (index === 0) {
      return {
        src: heroFeature?.imageUrl || shot.src,
        label: heroFeature?.name || shot.label,
        badge: heroFeature?.originBadge || shot.badge,
      };
    }
    return shot;
  });

  const primaryHeroImage = galleryShots[0]?.src || heroGalleryFallbacks[0].src;
  const primaryHeroLabel = galleryShots[0]?.label || "Seasonal profile";
  const primaryHeroBadge = galleryShots[0]?.badge || "Single-origin";
  const stackShots = galleryShots.slice(1, 4);

  return (
    <section className="section-shell section-shell--wide hero-shell">
      <div className="surface-hero hero-grid">
        <div className="hero-copy">
          <div className="flex flex-wrap items-center gap-3">
            <span className="pill">Origin Reserve · Daily Ritual</span>
            <div className="brand-crest">
              <span className="brand-crest__mark">AR</span>
              <div className="brand-crest__meta">
                <p className="eyebrow text-muted mb-1">Andy Roasting Co.</p>
                <p className="text-sm text-muted">Hanoi · Est. 2017</p>
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl leading-tight text-roast">
            Library roasts for deliberate mornings.
          </h1>
          <p className="text-lg text-muted max-w-2xl">
            Small-batch coffees profiled for clarity, wrapped with handwritten brew notes and a slow
            bar spirit. Built for quiet rituals, not rush orders.
          </p>
          <div className="logo-ribbon">
            <span>Hanoi Roastery</span>
            <span>Library roast</span>
            <span>Analogue brew notes</span>
            <span>Wishlist archive</span>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <a className="btn-primary" href="/shop">
              Shop live lots
            </a>
            <a className="btn-ghost" href={heroFeature ? `/menu/${heroFeature.id}` : "/shop"}>
              View featured
            </a>
          </div>
          <div className="stat-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
                {stat.caption && <p className="caption">{stat.caption}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-photo">
            <ImageWithFallback
              src={primaryHeroImage}
              alt={primaryHeroLabel}
              className="w-full h-full object-cover"
            />
            <div className="hero-photo__meta">
              <p className="caption text-muted">Featured lot</p>
              <h3 className="text-2xl text-white">{primaryHeroLabel}</h3>
              <p className="flag-chip">{primaryHeroBadge}</p>
            </div>
          </div>
          <div className="hero-feature-card">
            {heroFeature ? (
              <>
                <p className="eyebrow text-muted">Now roasting</p>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-xl text-roast">{heroFeature.name}</h3>
                    <p className="text-sm text-muted">{regionLabel(heroFeature)}</p>
                  </div>
                  <p className="price mb-0">{formatPrice(heroFeature.price)}</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {flavorTokens(heroFeature)
                    .slice(0, 3)
                    .map((tag) => (
                      <span key={tag} className="note-chip">
                        {tag}
                      </span>
                    ))}
                </div>
                <p className="text-sm text-muted leading-relaxed mb-3">
                  {heroFeature.description || "Hand-roasted daily for clarity and sweetness."}
                </p>
                <div className="hero-feature-card__footer">
                  <div>
                    <p className="caption text-muted mb-1">250g · ships in 48h</p>
                    <p className="text-sm text-muted">Brew guide in every box.</p>
                  </div>
                  <a className="btn-primary" href={`/menu/${heroFeature.id}`}>
                    Reserve bag
                  </a>
                </div>
              </>
            ) : (
              <p className="text-muted mb-0">Fresh coffees are being profiled. Check back soon.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHighlights({ sections }: { sections: LandingSection[] }) {
  if (!sections.length) return null;
  return (
    <section className="section-shell section-gap">
      <div className="section-heading">
        <div>
          <p className="eyebrow text-muted">Origin map</p>
          <h2 className="text-3xl text-roast">Stories from every category</h2>
        </div>
      </div>
      <div className="collection-grid">
        {sections.map((section) => {
          const normalizedKey = (section.key || "default").toLowerCase();
          const fallbackImage =
            section.heroImage ||
            sectionImageFallbacks[normalizedKey] ||
            sectionImageFallbacks.default;
          const itemCount = section.items?.length ?? 0;
          return (
            <article key={section.key} className="surface-card highlight-card">
              <div className="highlight-card__media">
                <ImageWithFallback
                  src={fallbackImage}
                  alt={section.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="highlight-card__body">
                <p className="eyebrow text-muted uppercase">{section.key}</p>
                <h3 className="text-xl text-roast">{section.title}</h3>
                <p className="text-sm text-muted flex-1">
                  {section.subtitle || section.story}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <a className="btn-link" href={`/shop#${section.key}`}>
                    Shop this section
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <span className="flag-chip">
                    {itemCount > 0 ? `Top ${itemCount} lots` : "Fresh drops soon"}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AwardsAndPraise() {
  const awards = [
    { title: "Vietnam Coffee Awards", note: "2024 · Best Micro-Roaster" },
    { title: "SCA Design Jury", note: "Top 10 · Packaging & Storytelling" },
    { title: "Community Favorite", note: "4.9 ★ from weekly cuppings" },
  ];

  const compliments = [
    {
      quote: "Ordering is seamless and the brew cards make me look like a pro barista at home.",
      author: "Linh · Daily filter drinker",
    },
    {
      quote: "Wishlist keeps my lab drops organized. Everything ships fresh within two days.",
      author: "Tùng · Café owner",
    },
    {
      quote: "The team answers every sourcing question. It feels like a personal roaster.",
      author: "Mai · Home espresso",
    },
  ];

  return (
    <section className="section-shell section-gap">
      <div className="section-heading">
        <div>
          <p className="eyebrow text-muted">Recognition & Love</p>
          <h2 className="text-3xl text-roast">Awards and kind words</h2>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-5 mb-6">
        {awards.map((award) => (
          <div key={award.title} className="surface-card award-card">
            <Award className="w-10 h-10" />
            <div>
              <p className="eyebrow text-muted mb-1">{award.note}</p>
              <h3 className="text-xl text-roast mb-0">{award.title}</h3>
            </div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {compliments.map((praise) => (
          <div key={praise.quote} className="surface-card praise-card">
            <Quote className="w-8 h-8" />
            <p className="mb-3">{praise.quote}</p>
            <p className="caption text-muted">{praise.author}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function JournalDigest({
  entries,
}: {
  entries: { title: string; summary?: string; excerpt?: string; slug: string; subtitle?: string }[];
}) {
  if (!entries.length) return null;
  return (
    <section className="section-shell section-gap">
      <div className="section-heading">
        <div>
          <p className="eyebrow text-muted">Journal</p>
          <h2 className="text-3xl text-roast">Notes from the cupping table</h2>
        </div>
        <a className="btn-primary" href="/journal">
          Read all entries
        </a>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {entries.map((post) => (
          <article key={post.slug} className="surface-card journal-card">
            <p className="eyebrow text-muted uppercase">{post.subtitle || "Story"}</p>
            <h3 className="text-xl text-roast">{post.title}</h3>
            <p className="text-sm text-muted flex-1">{post.excerpt || post.summary}</p>
            <a className="btn-link" href={`/journal#${post.slug}`}>
              Keep reading
              <ArrowRight className="w-4 h-4" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}


function Footer() {
  return (
    <footer className="brand-footer">
      <div className="section-shell footer-inner">
        <div className="footer-brand">
          <h3 className="text-xl text-roast">Andy Roasting Co.</h3>
          <p className="text-sm text-muted">
            Specialty coffee roastery in Hanoi. Live menu, wishlist, and ordering connected directly
            to the bar.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <p className="eyebrow text-muted mb-2">Shop</p>
            <a href="/shop">All coffees</a>
            <a href="/cart">Cart</a>
          </div>
          <div>
            <p className="eyebrow text-muted mb-2">Account</p>
            <a href="/wishlist">Wishlist</a>
            <a href="/orders">Orders</a>
            <a href="/login">Login</a>
          </div>
          <div>
            <p className="eyebrow text-muted mb-2">Studio</p>
            <a href="/about">About</a>
            <a href="/journal">Journal</a>
          </div>
        </div>
      </div>
      <div className="footer-base">
        <p>© {new Date().getFullYear()} Andy Roasting Co. Crafted with intention.</p>
        <p className="caption">📍 Hanoi, Vietnam | Roasted by Dinh Phong</p>
      </div>
    </footer>
  );
}

function NavBar() {
  return (
    <header className="brand-nav">
      <div className="section-shell section-shell--wide nav-inner">
        <a className="brand-mark" href="/">
          Andy Roasting Co.
        </a>
        <nav className="nav-links">
          <a href="/shop">Shop</a>
          <a href="/about">About</a>
          <a href="/journal">Journal</a>
          <a href="/wishlist">Wishlist</a>
          <a href="/orders">Orders</a>
        </nav>
        <div className="nav-actions">
          <a className="btn-ghost" href="/cart">
            Cart
          </a>
          <a className="btn-primary" href="/login">
            Account
          </a>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const landing = useLandingData();
  const heroFeature = useMemo(
    () =>
      landing.data?.featuredItems?.[0] ||
      landing.data?.highlightCoffees?.[0] ||
      landing.data?.sectionHighlights?.[0]?.items?.[0] ||
      null,
    [landing.data]
  );

  const featuredItems = landing.data?.featuredItems ?? [];
  const highlightCoffees = landing.data?.highlightCoffees ?? [];
  const sections = landing.data?.sectionHighlights ?? [];
  const journal = landing.data?.journalPreview ?? [];
  const stats = landing.data?.heroStats || fallbackStats;

  const orderPreview = useMemo<OrderPreviewItem[]>(() => {
    const sampleItems = [...featuredItems, ...highlightCoffees].slice(0, 3);
    if (sampleItems.length) {
      return sampleItems.map((item, index) => ({
        name: item.name,
        detail: item.process || item.variety || item.roast || "12oz bag",
        price: Number.isFinite(item.price) ? (item.price as number) : 14 + index * 2,
      }));
    }
    return [
      { name: "Khe Sanh Bloom", detail: "12oz washed", price: 18 },
      { name: "Da Lat Honey", detail: "12oz honey process", price: 20 },
      { name: "Hanoi Night", detail: "12oz espresso", price: 16 },
    ];
  }, [featuredItems, highlightCoffees]);

  return (
    <div className="page bg-cream">
      <NavBar />
      {landing.error && (
        <div className="section-shell pt-4">
          <div className="surface-card border border-red-200 bg-red-50 text-red-800 px-4 py-3">
            {landing.error}
          </div>
        </div>
      )}
      <HeroSection heroFeature={heroFeature} stats={stats} />
      <CardCollection
        id="featured"
        eyebrow="Current menu"
        title="Seasonal lots with full transparency"
        description="Rotating micro-lots roasted at dawn, with traceability cards tucked into every bag."
        cta={{ label: "View all coffees", href: "/shop" }}
        items={featuredItems}
        isLoading={landing.isLoading}
        emptyMessage="Fresh coffees are being profiled. Check back soon."
        fallbackImage={getFallbackProductImage}
      />
      <CardCollection
        id="shop"
        eyebrow="Pulled from the bar"
        title="Live selections pulled from our database"
        description="Updated from the espresso bar every morning so you can track each roast as it lands."
        cta={{ label: "Browse all coffees", href: "/shop" }}
        items={highlightCoffees}
        isLoading={landing.isLoading}
        emptyMessage="Our roasting schedule is being updated. Check back shortly for fresh releases."
        fallbackImage={getFallbackProductImage}
        startIndex={3}
      />
      <AwardsAndPraise />
      <JournalDigest entries={journal} />
      <Footer />
    </div>
  );
}
