import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";

const coffees = [
  {
    name: "Yirgacheffe Dawn",
    origin: "Ethiopia",
    region: "Gedeo Zone",
    notes: "Bergamot, Jasmine, Honey",
    image: "https://images.unsplash.com/photo-1710752213640-aa9ed91a8646?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGhpb3BpYW4lMjBjb2ZmZWV8ZW58MXx8fHwxNzYyNDIwMjU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "$22",
  },
  {
    name: "Huila Sunset",
    origin: "Colombia",
    region: "Huila Department",
    notes: "Caramel, Orange, Almond",
    image: "https://images.unsplash.com/photo-1649616549847-d74c98f36edd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYSUyMGNvZmZlZSUyMGZhcm18ZW58MXx8fHwxNzYyNDk3NzY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "$20",
  },
  {
    name: "Antigua Volcanic",
    origin: "Guatemala",
    region: "Antigua Valley",
    notes: "Dark Chocolate, Spice, Cherry",
    image: "https://images.unsplash.com/photo-1642613630414-1d9938f4fe02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWF0ZW1hbGElMjBjb2ZmZWV8ZW58MXx8fHwxNzYyNDk3NzY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "$21",
  },
  {
    name: "Nyeri Highlands",
    origin: "Kenya",
    region: "Nyeri County",
    notes: "Blackcurrant, Tomato, Brown Sugar",
    image: "https://images.unsplash.com/photo-1756121422046-8a3638d75efb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZW55YSUyMGNvZmZlZSUyMGNoZXJyaWVzfGVufDF8fHx8MTc2MjQ5Nzc2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "$24",
  },
  {
    name: "Brazil Cerrado",
    origin: "Brazil",
    region: "Minas Gerais",
    notes: "Hazelnut, Cocoa, Caramel",
    image: "https://images.unsplash.com/photo-1606152891041-3678607fb241?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGVjaWFsdHklMjBjb2ZmZWUlMjBwb3VyfGVufDF8fHx8MTc2MjQ5Nzc2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "$18",
  },
  {
    name: "Sumatra Mandheling",
    origin: "Indonesia",
    region: "North Sumatra",
    notes: "Cedar, Earth, Dark Chocolate",
    image: "https://images.unsplash.com/photo-1626376010399-a82e5ce6de37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjByb2FzdGluZyUyMGJlYW5zfGVufDF8fHx8MTc2MjQ1MjI3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "$19",
  },
];

export function CoffeeGrid() {
  return (
    <section id="shop" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl mb-6">Our Current Selection</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Each coffee is carefully sourced from trusted farmers and roasted to highlight 
            its unique characteristics.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {coffees.map((coffee) => (
            <div key={coffee.name} className="group bg-white overflow-hidden cursor-pointer">
              <div className="relative h-96 overflow-hidden bg-neutral-100">
                <ImageWithFallback
                  src={coffee.image}
                  alt={`${coffee.name} coffee`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              <div className="p-8">
                <div className="mb-4">
                  <h3 className="text-2xl mb-2">{coffee.name}</h3>
                  <p className="text-neutral-600">{coffee.origin}</p>
                  <p className="text-sm text-neutral-500">{coffee.region}</p>
                </div>
                
                <p className="text-sm text-neutral-600 mb-4 italic">{coffee.notes}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <p className="text-2xl">{coffee.price}</p>
                  <Button variant="outline" size="sm">Add to Cart</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
