import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CoffeeCardProps {
  name: string;
  origin: string;
  region: string;
  process: string;
  roastLevel: string;
  tastingNotes: string[];
  image: string;
  price: string;
}

export function CoffeeCard({
  name,
  origin,
  region,
  process,
  roastLevel,
  tastingNotes,
  image,
  price,
}: CoffeeCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative landing-card-media overflow-hidden bg-neutral-100">
        <ImageWithFallback
          src={image}
          alt={`${name} coffee from ${origin}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {roastLevel}
          </Badge>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-2xl text-amber-900 mb-1">{name}</h3>
          <p className="text-neutral-600">{origin}</p>
          <p className="text-sm text-neutral-500">{region}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tastingNotes.map((note) => (
            <Badge key={note} variant="outline" className="border-amber-200 text-amber-800">
              {note}
            </Badge>
          ))}
        </div>
        
        <div className="pt-2 border-t border-neutral-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-neutral-500">Process</p>
              <p className="text-sm text-neutral-700">{process}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl text-amber-900">{price}</p>
              <p className="text-xs text-neutral-500">per 12oz bag</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
