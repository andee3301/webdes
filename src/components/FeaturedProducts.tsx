import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

const products = [
  {
    name: "Yirgacheffe Natural",
    region: "Gedeo Zone",
    cultivar: "Heirloom",
    country: "Ethiopia",
    flag: "🇪🇹",
    altitude: "1,900-2,200m",
    roast: "Light",
    price: "$24",
    image: "https://images.unsplash.com/photo-1633275858168-d53d224b2a8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGhpb3BpYSUyMGNvZmZlZSUyMGJlYW5zfGVufDF8fHx8MTc2MjUwMDc2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    flavors: ["Blueberry", "Jasmine", "Stone Fruit"],
    description: "A stunning natural process coffee with explosive berry notes and floral complexity. Perfect for pour over brewing."
  },
  {
    name: "Huila Supremo",
    region: "Huila Department",
    cultivar: "Caturra",
    country: "Colombia",
    flag: "🇨🇴",
    altitude: "1,600-1,850m",
    roast: "Medium",
    price: "$22",
    image: "https://images.unsplash.com/photo-1756121422046-8a3638d75efb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYSUyMGNvZmZlZSUyMGNoZXJyaWVzfGVufDF8fHx8MTc2MjUwMDc2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    flavors: ["Caramel", "Orange", "Almond"],
    description: "Classic Colombian profile with bright citrus acidity balanced by sweet caramel notes. Versatile for all brewing methods."
  },
  {
    name: "Nyeri AA Top",
    region: "Nyeri County",
    cultivar: "SL-28, SL-34",
    country: "Kenya",
    flag: "🇰🇪",
    altitude: "1,700-1,900m",
    roast: "Medium-Light",
    price: "$26",
    image: "https://images.unsplash.com/photo-1644433233384-a28e2a225bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZW55YSUyMGNvZmZlZSUyMGZhcm18ZW58MXx8fHwxNzYyNTAwNzYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    flavors: ["Blackcurrant", "Tomato", "Brown Sugar"],
    description: "Iconic Kenyan complexity with signature tomato-like acidity and blackcurrant sweetness. AA grade beans from high-altitude farms."
  },
  {
    name: "Đà Lạt Arabica",
    region: "Lâm Đồng Province",
    cultivar: "Catimor, Typica",
    country: "Vietnam",
    flag: "🇻🇳",
    altitude: "1,400-1,600m",
    roast: "Medium",
    price: "$20",
    image: "https://images.unsplash.com/photo-1663125365422-dab15325277a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwY29mZmVlJTIwZmFybXxlbnwxfHx8fDE3NjI0OTk3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    flavors: ["Chocolate", "Hazelnut", "Honey"],
    description: "Smooth Vietnamese highlands arabica with rich body and chocolatey sweetness. Grown in the cool climate of Đà Lạt."
  },
  {
    name: "Antigua Volcanic",
    region: "Antigua Valley",
    cultivar: "Bourbon",
    country: "Guatemala",
    flag: "🇬🇹",
    altitude: "1,500-1,700m",
    roast: "Medium-Dark",
    price: "$23",
    image: "https://images.unsplash.com/photo-1625465115622-4a265061db77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjByb2FzdGluZyUyMHByb2Nlc3N8ZW58MXx8fHwxNzYyNDEyNjAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    flavors: ["Dark Chocolate", "Spice", "Smoke"],
    description: "Full-bodied coffee from volcanic soil with rich chocolate and subtle smokiness. Perfect for espresso or French press."
  },
  {
    name: "Sumatra Mandheling",
    region: "North Sumatra",
    cultivar: "Timor Hybrid",
    country: "Indonesia",
    flag: "🇮🇩",
    altitude: "1,100-1,300m",
    roast: "Dark",
    price: "$21",
    image: "https://images.unsplash.com/photo-1626376010399-a82e5ce6de37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjByb2FzdGluZyUyMGJlYW5zfGVufDF8fHx8MTc2MjQ1MjI3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    flavors: ["Earth", "Cedar", "Dark Chocolate"],
    description: "Classic Indonesian wet-hulled coffee with low acidity and heavy body. Deep earthy flavors and syrupy texture."
  }
];

export function FeaturedProducts() {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const toggleWishlist = (productName: string) => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productName)) {
        newSet.delete(productName);
      } else {
        newSet.add(productName);
      }
      return newSet;
    });
  };

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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product) => (
            <div key={product.name} className="group bg-white border border-neutral-200 hover:border-orange-600 transition-all duration-300 overflow-hidden">
              <div className="relative h-64 overflow-hidden bg-neutral-100">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <button 
                  onClick={() => toggleWishlist(product.name)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                >
                  <Heart 
                    className={`w-5 h-5 ${wishlist.has(product.name) ? 'fill-orange-600 text-orange-600' : 'text-neutral-600'}`} 
                  />
                </button>
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-sm">
                  {product.roast} Roast
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-2xl mb-2">{product.name}</h3>
                  <p className="text-sm text-neutral-600 flex items-center gap-2">
                    <span className="text-xl">{product.flag}</span>
                    {product.region}, {product.country}
                  </p>
                </div>
                
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Cultivar:</span>
                    <span className="text-neutral-800">{product.cultivar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Altitude:</span>
                    <span className="text-neutral-800">{product.altitude}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.flavors.map((flavor) => (
                    <Badge 
                      key={flavor} 
                      variant="outline" 
                      className="border-orange-600 text-orange-700 bg-orange-50"
                    >
                      {flavor}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-sm text-neutral-700 leading-relaxed mb-6">
                  {product.description}
                </p>
                
                <div className="flex items-center gap-2 pt-4 border-t border-neutral-200">
                  <Button className="flex-1 bg-black text-white hover:bg-orange-600 transition-colors">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.price}
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
