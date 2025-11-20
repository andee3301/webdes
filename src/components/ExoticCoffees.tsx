import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sparkles } from "lucide-react";

const exoticCoffees = [
  {
    name: "Panama Geisha Esmeralda",
    country: "🇵🇦 Panama",
    process: "Washed",
    rarity: "Ultra Rare",
    price: "$85",
    image: "https://images.unsplash.com/photo-1609942537601-f09866215c5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZWlzaGElMjBjb2ZmZWUlMjBiZWFuc3xlbnwxfHx8fDE3NjI1MDEyNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "The legendary Geisha varietal from Hacienda La Esmeralda. Explosive jasmine aromatics with bergamot, peach, and honey notes. Multiple Cup of Excellence winner.",
    notes: ["Jasmine", "Bergamot", "Peach", "Honey"]
  },
  {
    name: "Ethiopia Carbonic Maceration",
    country: "🇪🇹 Ethiopia",
    process: "Carbonic Maceration",
    rarity: "Limited Edition",
    price: "$42",
    image: "https://images.unsplash.com/photo-1585435247026-1d8560423d52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBmZXJtZW50YXRpb24lMjBwcm9jZXNzfGVufDF8fHx8MTc2MjUwMTI2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Experimental carbonic maceration processing creates wine-like complexity. Intense fruit fermentation with strawberry candy, tropical fruit, and sparkling acidity.",
    notes: ["Strawberry", "Tropical", "Wine", "Funk"]
  },
  {
    name: "Kopi Luwak Reserve",
    country: "🇮🇩 Indonesia",
    process: "Natural + Civet",
    rarity: "Extremely Rare",
    price: "$120",
    image: "https://images.unsplash.com/photo-1733938941418-df8bf946c6aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3BpJTIwbHV3YWslMjBjb2ZmZWV8ZW58MXx8fHwxNzYyNTAxMjYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "The world's most controversial coffee. Wild civets naturally select and process the ripest cherries. Smooth, complex cup with earthy chocolate and minimal bitterness.",
    notes: ["Chocolate", "Earth", "Smooth", "Caramel"]
  }
];

export function ExoticCoffees() {
  return (
    <section id="exotic" className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-orange-500" />
            <h2 className="text-6xl md:text-7xl" style={{ 
              fontFamily: 'serif',
              fontWeight: 400,
              letterSpacing: '0.05em'
            }}>
              Exotic<br className="md:hidden" /> Collection
            </h2>
            <Sparkles className="w-8 h-8 text-orange-500" />
          </div>
          <div className="w-24 h-1 bg-orange-600 mx-auto mb-6"></div>
          <p className="text-neutral-400 max-w-2xl mx-auto mb-4">
            The world's rarest and most sought-after coffees. Limited availability, 
            extraordinary processing methods, and unforgettable flavor profiles.
          </p>
          <Badge className="bg-orange-600 text-white">
            Only 3 Available This Season
          </Badge>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {exoticCoffees.map((coffee) => (
            <div key={coffee.name} className="group relative bg-neutral-900 border border-neutral-800 hover:border-orange-600 transition-all duration-300 overflow-hidden">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-orange-600 text-white">
                  {coffee.rarity}
                </Badge>
              </div>
              
              <div className="relative h-80 overflow-hidden">
                <ImageWithFallback
                  src={coffee.image}
                  alt={coffee.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-3xl mb-2">{coffee.name}</h3>
                  <p className="text-orange-400 text-sm mb-1">{coffee.country}</p>
                  <p className="text-neutral-400 text-sm">{coffee.process} Process</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {coffee.notes.map((note) => (
                    <Badge 
                      key={note} 
                      variant="outline" 
                      className="border-orange-600 text-orange-400 bg-orange-950/30"
                    >
                      {note}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                  {coffee.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                  <span className="text-2xl text-orange-500">{coffee.price}</span>
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
