import type { CSSProperties } from "react";
import { ArrowRight, Heart, ShoppingCart } from "lucide-react";
import type { LandingMenuItem } from "../hooks/useLandingData";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { formatPrice } from "../utils/format";
import { flavorTokens, regionLabel } from "../utils/landing";

type CardCollectionProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  items: LandingMenuItem[];
  isLoading: boolean;
  emptyMessage: string;
  fallbackImage: (index: number) => string;
  startIndex?: number;
};

function OrderActions({ item }: { item: LandingMenuItem }) {
  return (
    <div className="order-actions">
      <form action={`/cart/add/${item.id}`} method="POST" className="flex-1 min-w-[160px]">
        <input type="hidden" name="quantity" value="1" />
        <button type="submit" className="btn-primary w-full">
          <ShoppingCart className="w-4 h-4" />
          Add to cart
        </button>
      </form>
      <form action={`/wishlist/${item.id}/add`} method="POST" className="w-full sm:w-auto">
        <button type="submit" className="btn-muted w-full sm:w-auto">
          <Heart className="w-4 h-4" />
          Wishlist
        </button>
      </form>
      <a className="btn-link" href={`/menu/${item.id}`}>
        Details
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}

function CollectionCard({
  item,
  fallbackImage,
  index,
}: {
  item: LandingMenuItem;
  fallbackImage: string;
  index: number;
}) {
  const imageSource = item.imageUrl || fallbackImage;
  return (
    <article
      className="collection-card surface-card flex flex-col h-full"
      style={{ "--i": index } as CSSProperties}
    >
      <div className="collection-card__media">
        <ImageWithFallback
          src={imageSource}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <span className="chip chip-soft">
          {item.roast || item.roastLevel || "Seasonal roast"}
        </span>
      </div>
      <div className="collection-card__body">
        <div className="collection-card__headline">
          <div>
            <p className="eyebrow">{item.originBadge || item.originCountry || "Single-origin"}</p>
            <h3 className="text-2xl leading-tight text-roast">{item.name}</h3>
            <p className="caption">{regionLabel(item)}</p>
          </div>
          <div className="price-block">
            <p className="price">{formatPrice(item.price)}</p>
            <p className="caption">Ships in 48h</p>
          </div>
        </div>
        <div className="collection-tags">
          {flavorTokens(item)
            .slice(0, 4)
            .map((note) => (
              <span key={`${item.slug || item.id}-${note}`} className="note-chip">
                {note}
              </span>
            ))}
        </div>
        <p className="text-sm text-muted leading-relaxed">
          {item.description || "Hand-roasted to order for clarity and sweetness."}
        </p>
      </div>
      <div className="collection-card__footer">
        <OrderActions item={item} />
      </div>
    </article>
  );
}

export function CardCollection({
  id,
  eyebrow,
  title,
  description,
  cta,
  items,
  isLoading,
  emptyMessage,
  fallbackImage,
  startIndex = 0,
}: CardCollectionProps) {
  return (
    <section id={id} className="section-shell section-gap">
      <div className="section-heading">
        <div>
          <p className="eyebrow text-muted">{eyebrow}</p>
          <h2 className="text-3xl text-roast">{title}</h2>
          {description && <p className="section-copy text-muted">{description}</p>}
        </div>
        {cta && (
          <a className="btn-ghost" href={cta.href}>
            {cta.label}
          </a>
        )}
      </div>
      <div className="collection-grid">
        {isLoading && items.length === 0 && (
          <>
            {[...Array(6)].map((_, index) => (
              <div key={`collection-skeleton-${index}`} className="surface-card card-skeleton" />
            ))}
          </>
        )}
        {!isLoading && items.length === 0 && (
          <div className="surface-card empty-card">{emptyMessage}</div>
        )}
        {items.map((item, index) => (
          <CollectionCard
            key={item.slug || item.id}
            item={item}
            fallbackImage={fallbackImage(index + startIndex)}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
